
import { Controller, Post, Body, Get, UseGuards, Patch, Param } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  create(
    @Body()
    createInquiryDto: CreateInquiryDto,
  ) {
    return this.inquiryService.create(createInquiryDto);
  }

@Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.inquiryService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('clientId') clientId?: string,
  ) {
    return this.inquiryService.updateStatus(id, status, clientId);
  }
}

