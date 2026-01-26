import { Injectable } from '@nestjs/common';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async create(createCaseDto: CreateCaseDto) {
    // Expect clientId to be present in DTO
    return this.prisma.case.create({
      data: {
        case_number: createCaseDto.caseNumber,
        title: createCaseDto.title,
        case_type: createCaseDto.caseType,
        filing_date: new Date(createCaseDto.filingDate),
        notes: createCaseDto.notes,
        client: {
            connect: { id: createCaseDto.clientId }
        }
      },
    });
  }

  findAll(query?: string) {
    const where: any = {};
    if (query) {
      where.OR = [
        { case_number: { contains: query } },
        { client: { name: { contains: query } } }
      ];
    }

    return this.prisma.case.findMany({
      where,
      include: {
        client: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.case.findUnique({
      where: { id },
      include: {
        client: true,
        invoices: true,
        Appointment: true
      },
    });
  }

  update(id: string, updateCaseDto: UpdateCaseDto) {
    const data: any = { ...updateCaseDto };
    if (updateCaseDto.filingDate) {
        data.filing_date = new Date(updateCaseDto.filingDate);
    }
    delete data.filingDate;
    delete data.clientId; // Usually shouldn't change client
    delete data.caseNumber;

    return this.prisma.case.update({
      where: { id },
      data: data,
    });
  }

  remove(id: string) {
    return this.prisma.case.delete({ where: { id } });
  }
}
