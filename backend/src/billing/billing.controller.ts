import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Patch } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  findAll() {
    return this.billingService.findAll();
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  getStats() {
    return this.billingService.getStats();
  }

  @Get('unbilled-cases')
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  getInvoiceableCases() {
    return this.billingService.getInvoiceableCases();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.billingService.findOne(id);
  }

  @Post('invoice/:caseId')
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  generateInvoice(@Param('caseId', ParseIntPipe) caseId: number) {
    return this.billingService.generateInvoice(caseId);
  }

  @Post(':id/payment')
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  recordPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { amount: number; method: string; reference?: string; notes?: string },
  ) {
    return this.billingService.recordPayment(id, data);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.SECRETARY)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.billingService.updateStatus(id, status);
  }
}
