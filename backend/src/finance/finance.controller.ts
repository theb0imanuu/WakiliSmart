import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('finance')
@UseGuards(AuthGuard, RolesGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('invoices')
  @Roles('ADMIN', 'ADVOCATE', 'SECRETARY')
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.financeService.create(createInvoiceDto);
  }

  @Post('payments')
  @Roles('ADMIN', 'ADVOCATE', 'SECRETARY')
  recordPayment(@Body() recordPaymentDto: RecordPaymentDto) {
    return this.financeService.recordPayment(recordPaymentDto);
  }

  @Get('invoices')
  @Roles('ADMIN', 'ADVOCATE', 'SECRETARY')
  findAll() {
    return this.financeService.findAll();
  }

  @Get('invoices/:id')
  @Roles('ADMIN', 'ADVOCATE', 'SECRETARY')
  findOne(@Param('id') id: string) {
    return this.financeService.findOne(id);
  }
}
