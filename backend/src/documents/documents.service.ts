import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  create(createDocumentDto: CreateDocumentDto) {
    return this.prisma.document.create({
      data: createDocumentDto,
    });
  }

  findAll() {
    return this.prisma.document.findMany();
  }

  findOne(id: string) {
    return this.prisma.document.findUnique({ where: { id } });
  }

  update(id: string, updateDocumentDto: UpdateDocumentDto) {
    return this.prisma.document.update({
      where: { id },
      data: updateDocumentDto,
    });
  }

  async remove(id: string) {
    const document = await this.findOne(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    await unlinkAsync(document.path);
    return this.prisma.document.delete({ where: { id } });
  }
}
