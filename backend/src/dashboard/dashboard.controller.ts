import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('dashboard')
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('secretary')
  @Roles('SECRETARY')
  async getSecretaryDashboard() {
    return this.dashboardService.getSecretaryStats();
  }

  @Get('advocate')
  @Roles('ADVOCATE')
  async getAdvocateDashboard() {
    return this.dashboardService.getAdvocateStats();
  }
}
