import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DocumentsModule } from '../documents/documents.module';
import { AppointmentsModule } from '../appointments/appointments.module';

import { ReportsModule } from '../reports/reports.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [DocumentsModule, AppointmentsModule, ReportsModule, PrismaModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
