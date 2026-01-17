import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  create(createInvoiceDto: CreateInvoiceDto) {
    return this.prisma.invoice.create({
      data: createInvoiceDto,
    });
  }

  findAll() {
    return this.prisma.invoice.findMany({
      include: {
        case: {
          include: {
            client: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: {
        case: {
          include: {
            client: true,
          },
        },
        items: true,
        payments: true,
      },
    });
  }

  update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return this.prisma.invoice.update({
      where: { id },
      data: updateInvoiceDto,
    });
  }

  remove(id: string) {
    return this.prisma.invoice.delete({ where: { id } });
  }
}
