import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  private validateKenyanPhone(phone: string): boolean {
    // Basic regex for Kenyan phone numbers (Safaricom, Airtel, Telkom, Equitel)
    // Starts with +254, 254, or 0, followed by 7 or 1, and 8 digits.
    const regex = /^(?:254|\+254|0)?([71][0-9]{8})$/;
    return regex.test(phone);
  }

  async create(createAppointmentDto: CreateAppointmentDto) {
    if (!this.validateKenyanPhone(createAppointmentDto.clientPhone)) {
      throw new BadRequestException('Invalid Kenyan phone number');
    }

    // Find or Create Client
    let client = await this.prisma.client.findUnique({
      where: { phone: createAppointmentDto.clientPhone },
    });

    if (!client) {
      client = await this.prisma.client.create({
        data: {
          name: createAppointmentDto.clientName,
          phone: createAppointmentDto.clientPhone,
          email: createAppointmentDto.clientEmail,
        },
      });
    }

    return this.prisma.appointment.create({
      data: {
        date: new Date(createAppointmentDto.date),
        purpose: createAppointmentDto.purpose,
        client_id: client.id,
        status: 'PENDING',
      },
    });
  }

  findAll() {
    return this.prisma.appointment.findMany({
      include: {
        client: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });
  }

  update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const data: any = { ...updateAppointmentDto };
    if (updateAppointmentDto.date) {
        data.date = new Date(updateAppointmentDto.date);
    }
    // Remove non-model fields (clientName, etc) if they were passed in DTO
    delete data.clientName;
    delete data.clientPhone;
    delete data.clientEmail;

    return this.prisma.appointment.update({
      where: { id },
      data: data,
    });
  }

  remove(id: string) {
    return this.prisma.appointment.delete({ where: { id } });
  }
}
