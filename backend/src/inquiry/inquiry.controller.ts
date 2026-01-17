import { Controller, Post, Body, Get, UseGuards, Patch, Param } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  create(
    @Body()
    data: {
      name: string;
      email: string;
      phone: string;
      message: string;
    },
  ) {
    return this.inquiryService.create(data);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.inquiryService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.inquiryService.updateStatus(id, status);
  }
}
