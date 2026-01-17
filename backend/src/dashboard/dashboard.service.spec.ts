import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  appointment: { count: jest.fn(), findMany: jest.fn() },
  inquiry: { count: jest.fn() },
  invoice: { count: jest.fn() },
  case: { findMany: jest.fn() },
  payment: { aggregate: jest.fn(), findMany: jest.fn() },
};

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSecretaryStats', () => {
    it('should return secretary stats', async () => {
      mockPrismaService.appointment.count.mockResolvedValue(5);
      mockPrismaService.appointment.findMany.mockResolvedValue([]);
      mockPrismaService.inquiry.count.mockResolvedValue(2);
      mockPrismaService.invoice.count.mockResolvedValue(3);

      const result = await service.getSecretaryStats();

      expect(result).toEqual({
        todayAppointments: 5,
        todayAppointmentsList: [],
        pendingInquiries: 2,
        totalUnpaidInvoices: 3,
      });
      expect(mockPrismaService.appointment.count).toHaveBeenCalled();
      expect(mockPrismaService.appointment.findMany).toHaveBeenCalled();
    });
  });

  describe('getAdvocateStats', () => {
    it('should return advocate stats', async () => {
      mockPrismaService.case.findMany.mockResolvedValue([]);
      mockPrismaService.payment.aggregate.mockResolvedValue({ _sum: { amount: 1000 } });
      mockPrismaService.payment.findMany.mockResolvedValue([
        { amount: 100, date_recorded: new Date() },
      ]);

      const result = await service.getAdvocateStats();

      expect(result.totalRevenue).toBe(1000);
      expect(result.monthlyRevenue).toHaveLength(6);
      expect(result.activeCasesCount).toBe(0);
    });
  });
});
