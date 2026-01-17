import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Inquiry } from '@prisma/client';

@Injectable()
export class InquiryService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }): Promise<Inquiry> {
    return this.prisma.inquiry.create({
      data,
    });
  }

  async findAll(): Promise<Inquiry[]> {
    return this.prisma.inquiry.findMany({
      include: {
        client: true,
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<Inquiry> {
    return this.prisma.inquiry.update({
      where: { id },
      data: { status },
    });
  }
}
