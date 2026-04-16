import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CaseType, CaseStatus } from '@prisma/client';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.case.findMany({
      include: {
        client: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: { dateOpened: 'desc' },
    });
  }

  async create(data: {
    title: string;
    clientId: number;
    caseType: CaseType;
    priority: string;
    opposingParty?: string;
    courtTribunal: string;
    description?: string;
    createdById: number;
    subType?: string;
    courtCaseNumber?: string;
  }) {
    const caseNumber = `MAT-${Date.now().toString().slice(-6)}`;
    
    return this.prisma.case.create({
      data: {
        ...data,
        caseNumber,
        status: CaseStatus.OPEN,
      },
    });
  }

  async update(id: number, data: {
    status?: CaseStatus;
    title?: string;
    priority?: string;
    description?: string;
    legalIssues?: string;
    desiredOutcome?: string;
  }) {
    return this.prisma.case.update({
      where: { id },
      data,
    });
  }
}
