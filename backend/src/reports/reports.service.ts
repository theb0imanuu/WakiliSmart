import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics() {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // 1. Summary Metrics
    const [billedData, collectedData, caseCount, hoursData] = await Promise.all([
      this.prisma.invoice.aggregate({ _sum: { totalAmount: true } }),
      this.prisma.invoice.aggregate({ _sum: { amountPaid: true } }),
      this.prisma.case.count({ where: { status: { in: ['OPEN', 'ACTIVE'] } } }),
      this.prisma.timeEntry.aggregate({ _sum: { durationMinutes: true } }),
    ]);

    // 2. Case Distribution
    const caseTypeStats = await this.prisma.case.groupBy({
      by: ['caseType'],
      _count: true,
    });

    const caseData = caseTypeStats.map((stat) => ({
      name: stat.caseType,
      value: stat._count,
      color: this.getColorForType(stat.caseType),
    }));

    // 3. Revenue vs Expenses (6 Months)
    const monthlyInvoices = await this.prisma.invoice.findMany({
      where: { issueDate: { gte: sixMonthsAgo } },
      select: { issueDate: true, totalAmount: true },
    });

    const monthlyDisbursements = await this.prisma.disbursement.findMany({
      where: { disbursementDate: { gte: sixMonthsAgo } },
      select: { disbursementDate: true, amount: true },
    });

    const monthlyRevenue = this.groupByMonth(monthlyInvoices, 'issueDate', 'totalAmount', sixMonthsAgo);
    const monthlyExpenses = this.groupByMonth(monthlyDisbursements, 'disbursementDate', 'amount', sixMonthsAgo);

    const revenueData = Object.keys(monthlyRevenue).sort().map(monthKey => ({
      name: monthKey,
      revenue: (monthlyRevenue as Record<string, number>)[monthKey],
      expenses: (monthlyExpenses as Record<string, number>)[monthKey] || 0,
    }));

    // 4. Weekly Billable Hours
    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 6);
    last7Days.setHours(0, 0, 0, 0);

    const weeklyEntries = await this.prisma.timeEntry.findMany({
      where: { entryDate: { gte: last7Days } },
    });

    const timeData = this.groupByDay(weeklyEntries, last7Days);

    return {
      stats: {
        totalBilled: Number(billedData._sum.totalAmount || 0),
        totalCollected: Number(collectedData._sum.amountPaid || 0),
        activeCases: caseCount,
        billableHours: Math.round((Number(hoursData._sum.durationMinutes || 0)) / 60),
      },
      revenueData,
      caseData,
      timeData,
    };
  }

  private groupByMonth(items: any[], dateField: string, amountField: string, startFrom: Date) {
    const result: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize current 6 months
    for (let i = 0; i < 6; i++) {
        const d = new Date(startFrom);
        d.setMonth(startFrom.getMonth() + i);
        result[months[d.getMonth()]] = 0;
    }

    items.forEach(item => {
      const month = months[new Date(item[dateField]).getMonth()];
      if (result[month] !== undefined) {
        result[month] += Number(item[amountField]);
      }
    });

    return result;
  }

  private groupByDay(items: any[], startFrom: Date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    
    for (let i = 0; i < 7; i++) {
        const d = new Date(startFrom);
        d.setDate(startFrom.getDate() + i);
        const dayLabel = days[d.getDay()];
        
        const dayTotal = items
          .filter(item => new Date(item.entryDate).toDateString() === d.toDateString())
          .reduce((sum, item) => sum + item.durationMinutes, 0);
          
        result.push({ name: dayLabel, hours: Number((dayTotal / 60).toFixed(1)) });
    }
    return result;
  }

  private getColorForType(type: string) {
    const colors = {
      CIVIL: '#1e3a8a',
      CRIMINAL: '#ef4444',
      CONVEYANCING: '#10b981',
      FAMILY: '#f59e0b',
      COMMERCIAL: '#8b5cf6',
      OTHER: '#64748b',
    };
    return (colors as Record<string, string>)[type] || '#cbd5e1';
  }
}
