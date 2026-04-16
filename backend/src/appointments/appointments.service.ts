import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async checkConflict(
    date: Date,
    durationMinutes: number,
    excludeId?: number,
  ): Promise<boolean> {
    const proposedStart = new Date(date);
    const proposedEnd = new Date(
      proposedStart.getTime() + durationMinutes * 60000,
    );

    const existing = await this.prisma.appointment.findMany({
      where: {
        AND: [
          { status: { in: ['CONFIRMED', 'COMPLETED'] } },
          { id: { not: excludeId } },
        ],
      },
    });

    const hasConflict = existing.some((appt) => {
      const apptStart = new Date(appt.scheduledDate);
      const apptEnd = new Date(
        apptStart.getTime() + appt.durationMinutes * 60000,
      );
      return proposedStart < apptEnd && apptStart < proposedEnd;
    });

    return hasConflict;
  }

  async getDailyAppointments(date: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.appointment.findMany({
      where: {
        scheduledDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        client: {
          select: { fullName: true },
        },
        case: {
          select: { title: true },
        },
      },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async getPublicAvailability(date: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        scheduledDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { in: ['PENDING', 'CONFIRMED', 'RESCHEDULED'] }
      },
      select: {
        scheduledDate: true,
      },
    });

    return appointments.map(apt => apt.scheduledDate);
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      include: {
        client: {
          select: { fullName: true },
        },
        case: {
          select: { title: true },
        },
      },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async create(data: {
    scheduledDate: Date;
    durationMinutes: number;
    purpose?: string;
    clientId?: number;
    caseId?: number;
    isCourtDate?: boolean;
    courtName?: string;
    tempClientName?: string;
    tempClientPhone?: string;
  }) {
    return this.prisma.appointment.create({
      data,
    });
  }

  async approve(id: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    let resolvedClientId = appointment.clientId;

    if (!resolvedClientId && appointment.tempClientPhone) {
      // 1. Try to find client by phone
      let existingClient = await this.prisma.client.findFirst({
        where: {
          OR: [
            { phoneNumber: appointment.tempClientPhone },
            ...(appointment.tempClientEmail ? [{ email: appointment.tempClientEmail }] : []),
          ],
        },
      });

      if (existingClient) {
        resolvedClientId = existingClient.id;
      } else {
        // 2. Create new client automatically
        const clientNumber = `CLI-${Date.now().toString().slice(-6)}`;
        const newClient = await this.prisma.client.create({
          data: {
            clientId: clientNumber,
            fullName: appointment.tempClientName || 'Unknown Client',
            phoneNumber: appointment.tempClientPhone,
            email: appointment.tempClientEmail,
          },
        });
        resolvedClientId = newClient.id;
      }
    }

    // 3. Mark appointment confirmed and attach client
    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        clientId: resolvedClientId,
      },
    });
  }
}
