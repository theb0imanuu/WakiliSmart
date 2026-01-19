
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Inquiry } from '@prisma/client';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiryService {
  constructor(private prisma: PrismaService) {}

  async create(createInquiryDto: CreateInquiryDto): Promise<Inquiry> {
    const { name, email, phone, message, urgency } = createInquiryDto;
    return this.prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        message,
        urgency,
      },
    });
  }

  async findAll(): Promise<Inquiry[]> {
    return this.prisma.inquiry.findMany({
      include: {
        client: true,
      },
    });
  }

  async updateStatus(id: string, status: string, clientId?: string): Promise<Inquiry> {
    return this.prisma.inquiry.update({
      where: { id },
      data: { status, client_id: clientId },
    });
  }
}

