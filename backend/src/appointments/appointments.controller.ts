import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    // Public endpoint for booking
    return this.appointmentsService.create(createAppointmentDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @Roles('SECRETARY', 'ADMIN', 'ADVOCATE')
  findAll() {
    return this.appointmentsService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  @Roles('SECRETARY', 'ADMIN', 'ADVOCATE')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  @Roles('SECRETARY', 'ADMIN', 'ADVOCATE')
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('ADMIN', 'ADVOCATE')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
