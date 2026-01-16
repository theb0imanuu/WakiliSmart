import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { JwtService } from '@nestjs/jwt';

describe('DashboardController', () => {
  let controller: DashboardController;

  const mockDashboardService = {
    getSecretaryStats: jest.fn(),
    getAdvocateStats: jest.fn(),
  };

  const mockJwtService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: JwtService, useValue: mockJwtService },
        AuthGuard,
        RolesGuard,
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: () => true })
    .compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
