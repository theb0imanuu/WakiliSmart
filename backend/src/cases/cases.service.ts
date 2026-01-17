import { Injectable } from '@nestjs/common';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  create(createCaseDto: CreateCaseDto) {
    return this.prisma.case.create({
      data: createCaseDto,
    });
  }

  findAll(clientId?: string) {
    const where: any = {};
    if (clientId) {
      where.client_id = clientId;
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
      },
    });
  }

  update(id: string, updateCaseDto: UpdateCaseDto) {
    return this.prisma.case.update({
      where: { id },
      data: updateCaseDto,
    });
  }

  remove(id: string) {
    return this.prisma.case.delete({ where: { id } });
  }
}
