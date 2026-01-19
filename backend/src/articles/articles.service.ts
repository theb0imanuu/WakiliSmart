import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  create(createArticleDto: CreateArticleDto) {
    if (!createArticleDto.authorId) {
      throw new Error('Author ID is required');
    }
    return this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        category: createArticleDto.category,
        content: createArticleDto.content,
        author_id: createArticleDto.authorId,
      },
    });
  }

  findAll() {
    return this.prisma.article.findMany({
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.article.findUnique({ where: { id } });
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  remove(id: string) {
    return this.prisma.article.delete({ where: { id } });
  }
}
