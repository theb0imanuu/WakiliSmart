import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async getRecentDocuments(limit: number) {
    return this.prisma.document.findMany({
      take: limit,
      orderBy: { uploadedAt: 'desc' },
      include: {
        case: {
          select: { title: true },
        },
      },
    });
  }

  async getDocumentStats() {
    const counts = await this.prisma.document.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const stats = {
      DRAFTING: 0,
      AWAITING_SIG: 0,
      FILED: 0,
    };

    counts.forEach((item) => {
      stats[item.status] = item._count.id;
    });

    return stats;
  }
}
