import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const totalAmount = createInvoiceDto.items.reduce((sum, item) => sum + item.amount, 0);

    return this.prisma.invoice.create({
      data: {
        case_id: createInvoiceDto.caseId,
        amount: totalAmount,
        balance_due: totalAmount,
        serviceType: createInvoiceDto.serviceType,
        due_date: new Date(createInvoiceDto.dueDate),
        items: {
          create: createInvoiceDto.items,
        },
      },
      include: {
        items: true
      }
    });
  }

  async recordPayment(dto: RecordPaymentDto) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id: dto.invoiceId } });
    if (!invoice) throw new NotFoundException('Invoice not found');

    const newBalance = invoice.balance_due - dto.amount;
    const status = newBalance <= 0 ? 'PAID' : 'UNPAID';

    return this.prisma.$transaction(async (prisma) => {
        const payment = await prisma.payment.create({
            data: {
                amount: dto.amount,
                method: dto.method,
                transaction_reference: dto.transactionReference,
                invoice_id: dto.invoiceId,
            },
        });

        const updatedInvoice = await prisma.invoice.update({
            where: { id: dto.invoiceId },
            data: {
                balance_due: newBalance,
                status: status,
            },
        });

        return { payment, invoice: updatedInvoice };
    });
  }

  findAll() {
    return this.prisma.invoice.findMany({
      include: {
        case: {
            include: { client: true }
        },
        items: true,
        payments: true
      },
    });
  }

  findOne(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: {
        case: { include: { client: true } },
        items: true,
        payments: true,
      },
    });
  }
}
