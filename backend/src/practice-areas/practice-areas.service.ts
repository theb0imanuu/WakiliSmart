import { Injectable } from '@nestjs/common';
import { CreatePracticeAreaDto } from './dto/create-practice-area.dto';
import { UpdatePracticeAreaDto } from './dto/update-practice-area.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PracticeAreasService {
  constructor(private prisma: PrismaService) {}

  create(createPracticeAreaDto: CreatePracticeAreaDto) {
    return this.prisma.practiceArea.create({
      data: createPracticeAreaDto,
    });
  }

  findAll() {
    return this.prisma.practiceArea.findMany();
  }

  findOne(slug: string) {
    return this.prisma.practiceArea.findUnique({ where: { slug } });
  }

  update(id: string, updatePracticeAreaDto: UpdatePracticeAreaDto) {
    return this.prisma.practiceArea.update({
      where: { id },
      data: updatePracticeAreaDto,
    });
  }

  remove(id: string) {
    return this.prisma.practiceArea.delete({ where: { id } });
  }
}
