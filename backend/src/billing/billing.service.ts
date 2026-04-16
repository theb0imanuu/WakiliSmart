import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.invoice.findMany({
      include: {
        client: { select: { fullName: true } },
        case: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        case: true,
        lineItems: true,
        payments: true,
      },
    });
    if (!invoice) throw new BadRequestException('Invoice not found');
    return invoice;
  }

  async getStats() {
    const invoices = await this.prisma.invoice.findMany({
      where: { status: { not: 'VOIDED' } },
    });

    const stats = {
      totalRevenue: 0,
      outstanding: 0,
      paidCount: 0,
      overdueCount: 0,
    };

    const now = new Date();

    invoices.forEach((inv) => {
      stats.totalRevenue += inv.amountPaid.toNumber();
      stats.outstanding += inv.balanceDue.toNumber();
      if (inv.status === 'PAID') stats.paidCount++;
      // Auto-detect overdue on the fly
      if (inv.status !== 'PAID' && inv.dueDate && inv.dueDate < now) {
        stats.overdueCount++;
      }
    });

    return stats;
  }

  async generateInvoice(caseId: number) {
    const caseDetails = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: { client: true },
    });

    if (!caseDetails) throw new BadRequestException('Case not found');

    const timeEntries = await this.prisma.timeEntry.findMany({
      where: { caseId, isBilled: false },
    });

    const disbursements = await this.prisma.disbursement.findMany({
      where: { caseId, isBilled: false },
    });

    if (timeEntries.length === 0 && disbursements.length === 0) {
      throw new BadRequestException('No unbilled work found for this case');
    }

    let subtotal = 0;
    const lineItems = [];

    for (const entry of timeEntries) {
      const hours = entry.durationMinutes / 60;
      const rate = entry.hourlyRate.toNumber();
      const amount = hours * rate;
      subtotal += amount;

      lineItems.push({
        itemType: 'TIME_ENTRY',
        description: `${entry.activityType}: ${entry.description}`,
        quantity: hours,
        unitPrice: rate,
        amount: amount,
        timeEntryId: entry.id,
      });
    }

    for (const disb of disbursements) {
      const disbAmount = disb.amount.toNumber();
      subtotal += disbAmount;
      lineItems.push({
        itemType: 'DISBURSEMENT',
        description: disb.description,
        quantity: 1,
        unitPrice: disbAmount,
        amount: disbAmount,
        disbursementId: disb.id,
      });
    }

    // Check statutory minimum compliance
    const feeSchedule = await this.prisma.feeSchedule.findFirst({
      where: { caseType: caseDetails.caseType },
      orderBy: { effectiveFrom: 'desc' },
    });

    if (
      feeSchedule &&
      subtotal > 0 &&
      subtotal < feeSchedule.statutoryMinimum.toNumber()
    ) {
      throw new BadRequestException(
        `Fee below statutory minimum of KES ${feeSchedule.statutoryMinimum.toString()}`,
      );
    }

    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        caseId,
        clientId: caseDetails.clientId,
        subtotal,
        taxAmount: 0,
        totalAmount: subtotal,
        balanceDue: subtotal,
        status: 'DRAFT',
        lineItems: {
          create: lineItems,
        },
      },
      include: { lineItems: true },
    });

    // Mark items as billed
    await this.prisma.timeEntry.updateMany({
      where: { id: { in: timeEntries.map(e => e.id) } },
      data: { isBilled: true, invoiceId: invoice.id },
    });

    await this.prisma.disbursement.updateMany({
      where: { id: { in: disbursements.map(e => e.id) } },
      data: { isBilled: true, invoiceId: invoice.id },
    });

    return invoice;
  }

  async getInvoiceableCases() {
    // Find cases that have unbilled entries
    const casesWithUnbilledTime = await this.prisma.case.findMany({
      where: {
        timeEntries: { some: { isBilled: false } }
      },
      select: {
        id: true,
        caseNumber: true,
        title: true,
        client: { select: { fullName: true } }
      }
    });

    const casesWithUnbilledDisb = await this.prisma.case.findMany({
      where: {
        disbursements: { some: { isBilled: false } }
      },
      select: {
        id: true,
        caseNumber: true,
        title: true,
        client: { select: { fullName: true } }
      }
    });

    // Merge and deduplicate
    const casesMap = new Map();
    [...casesWithUnbilledTime, ...casesWithUnbilledDisb].forEach(c => {
      casesMap.set(c.id, c);
    });

    return Array.from(casesMap.values());
  }

  async recordPayment(id: number, data: { amount: number; method: any; reference?: string; notes?: string }) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new BadRequestException('Invoice not found');

    const payment = await this.prisma.payment.create({
      data: {
        invoiceId: id,
        amount: data.amount,
        method: data.method,
        reference: data.reference,
        notes: data.notes,
        paymentDate: new Date(),
      },
    });

    const newAmountPaid = invoice.amountPaid.toNumber() + data.amount;
    const newBalanceDue = invoice.totalAmount.toNumber() - newAmountPaid;

    let newStatus = invoice.status;
    if (newBalanceDue <= 0) {
      newStatus = 'PAID';
    } else if (newAmountPaid > 0) {
      newStatus = 'PARTIALLY_PAID';
    }

    await this.prisma.invoice.update({
      where: { id },
      data: {
        amountPaid: newAmountPaid,
        balanceDue: Math.max(0, newBalanceDue),
        status: newStatus as any,
      },
    });

    return payment;
  }

  async updateStatus(id: number, status: string) {
    return this.prisma.invoice.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
