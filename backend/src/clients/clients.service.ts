import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.findMany({
      include: {
        _count: {
          select: { cases: true },
        },
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async create(data: {
    fullName: string;
    phone: string;
    email?: string;
    physicalAddress?: string;
    idNumber?: string;
    occupation?: string;
    notes?: string;
  }) {
    const clientNumber = `CLI-${Date.now().toString().slice(-6)}`;
    
    return this.prisma.client.create({
      data: {
        ...data,
        clientId: clientNumber, // Maps to 'clientId' in schema
        phoneNumber: data.phone, // Maps to 'phoneNumber' in schema
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.client.findUnique({
      where: { id },
      include: {
        cases: {
          orderBy: { dateOpened: 'desc' },
        },
        _count: {
          select: { cases: true },
        },
      },
    });
  }

  async update(id: number, data: any) {
    const updateData = { ...data };
    
    // Remap phone to phoneNumber if present
    if (updateData.phone) {
      updateData.phoneNumber = updateData.phone;
      delete updateData.phone;
    }
    
    // Remap address to physicalAddress if present
    if (updateData.address) {
      updateData.physicalAddress = updateData.address;
      delete updateData.address;
    }

    return this.prisma.client.update({
      where: { id },
      data: updateData,
    });
  }
}
