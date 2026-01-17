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

    const todayAppointmentsList = await this.prisma.appointment.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        client: true,
      },
      orderBy: {
        date: 'asc',
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
      todayAppointmentsList,
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

    // Revenue calculations
    const totalRevenueResult = await this.prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
    });
    const totalRevenue = totalRevenueResult._sum.amount || 0;

    // Monthly revenue for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start of the month 6 months ago

    const payments = await this.prisma.payment.findMany({
      where: {
        date_recorded: {
          gte: sixMonthsAgo,
        },
      },
    });

    const monthlyRevenue = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = d.toLocaleString('default', { month: 'short' });
      // We want to group by month/year to be precise, but for this chart simple month name is enough
      // Assuming we are just showing the last 6 months.

      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);

      const sum = payments
        .filter(
          (p) =>
            p.date_recorded >= monthStart && p.date_recorded <= monthEnd,
        )
        .reduce((acc, curr) => acc + curr.amount, 0);

      monthlyRevenue.unshift({ month: monthName, amount: sum });
    }

    return {
      upcomingDeadlines,
      activeCases,
      activeCasesCount: activeCases.length,
      totalRevenue,
      monthlyRevenue,
    };
  }
}
