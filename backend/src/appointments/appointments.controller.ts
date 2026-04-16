import { Controller, Get, Post, Body, UseGuards, Query, Patch, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.appointmentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createAppointmentDto: any) {
    return this.appointmentsService.create({
      ...createAppointmentDto,
      scheduledDate: new Date(createAppointmentDto.scheduledDate),
      clientId: createAppointmentDto.clientId ? Number(createAppointmentDto.clientId) : undefined,
      caseId: createAppointmentDto.caseId ? Number(createAppointmentDto.caseId) : undefined,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    return this.appointmentsService.approve(+id);
  }

  @Post('public')
  async createPublic(@Body() createAppointmentDto: any) {
    return this.appointmentsService.create({
      ...createAppointmentDto,
      scheduledDate: new Date(createAppointmentDto.scheduledDate),
      durationMinutes: 30,
      isCourtDate: false,
    });
  }

  @Get('public/availability')
  async getPublicAvailability(@Query('date') date: string) {
    return this.appointmentsService.getPublicAvailability(date);
  }
}
