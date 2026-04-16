import { Injectable } from '@nestjs/common';
import { DocumentsService } from '../documents/documents.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from '../reports/reports.service';

@Injectable()
export class DashboardService {
  constructor(
    private documentsService: DocumentsService,
    private appointmentsService: AppointmentsService,
    private prisma: PrismaService,
    private reportsService: ReportsService,
  ) {}

  async getAdminSummary() {
    return this.reportsService.getAnalytics();
  }

  async getSecretarySummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      recentFiles, 
      documentStats, 
      appointments, 
      activeCases, 
      pendingBookings, 
      todayPayments, 
      newClients
    ] = await Promise.all([
      this.documentsService.getRecentDocuments(5),
      this.documentsService.getDocumentStats(),
      this.appointmentsService.getDailyAppointments(today.toISOString().split('T')[0]),
      this.prisma.case.count({ where: { status: 'ACTIVE' } }),
      this.prisma.appointment.count({ where: { status: 'PENDING' } }),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paymentDate: { gte: today } },
      }),
      this.prisma.client.count({ where: { createdAt: { gte: monthStart } } }),
    ]);

    const alerts = [
      {
        id: 1,
        title: 'Requires Attention',
        message: `${pendingBookings} pending bookings need to be reviewed.`,
        type: 'info',
      },
    ];

    return {
      recentFiles,
      documentStats,
      appointments,
      alerts,
      stats: {
        activeCases,
        pendingBookings,
        todayRevenue: Number(todayPayments._sum.amount || 0),
        newClients,
      }
    };
  }
}
