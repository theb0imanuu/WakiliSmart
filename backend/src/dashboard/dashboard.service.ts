import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSecretaryStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await this.prisma.appointment.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const pendingInquiries = await this.prisma.inquiry.count({
      where: {
        status: 'PENDING',
      },
    });

    const totalUnpaidInvoices = await this.prisma.invoice.count({
      where: {
        status: 'UNPAID',
      },
    });

    return {
      todayAppointments,
      pendingInquiries,
      totalUnpaidInvoices,
    };
  }

  async getAdvocateStats() {
    // Upcoming deadlines: filing_date within next 30 days
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    const upcomingDeadlines = await this.prisma.case.findMany({
      where: {
        filing_date: {
          gte: today,
          lte: nextMonth,
        },
      },
      orderBy: {
        filing_date: 'asc',
      },
      take: 5,
    });

    const activeCases = await this.prisma.case.findMany({
      where: {
        status: {
          notIn: ['CLOSED', 'ARCHIVED'],
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        client: true,
      },
    });

    return {
      upcomingDeadlines,
      activeCases,
      activeCasesCount: activeCases.length,
    };
  }
}
