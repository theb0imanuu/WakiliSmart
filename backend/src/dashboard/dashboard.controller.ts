import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin-summary')
  @Roles(UserRole.ADMIN, UserRole.ADVOCATE)
  async getAdminSummary() {
    return this.dashboardService.getAdminSummary();
  }

  @Get('secretary-summary')
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  async getSecretarySummary() {
    return this.dashboardService.getSecretarySummary();
  }
}
