import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { CasesModule } from './cases/cases.module';
import { BookingsModule } from './bookings/bookings.module';
import { BillingModule } from './billing/billing.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ClientsModule,
    CasesModule,
    BookingsModule,
    BillingModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}