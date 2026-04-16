import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { ClientsModule } from './clients/clients.module';
import { CasesModule } from './cases/cases.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { BillingModule } from './billing/billing.module';
import { DocumentsModule } from './documents/documents.module';
import { ReportsModule } from './reports/reports.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    CasesModule,
    AppointmentsModule,
    BillingModule,
    DocumentsModule,
    ReportsModule,
    AuditLogsModule,
    DashboardModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
