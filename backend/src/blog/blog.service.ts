import { Injectable } from '@nestjs/common';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  create(createBlogPostDto: CreateBlogPostDto) {
    return this.prisma.blogPost.create({
      data: {
        title: createBlogPostDto.title,
        category: createBlogPostDto.category,
        content: createBlogPostDto.content,
        bannerPath: createBlogPostDto.bannerPath,
        author: {
          connect: { id: createBlogPostDto.authorId },
        },
      },
    });
  }

  findAll() {
    return this.prisma.blogPost.findMany({
      include: {
        author: {
          select: {
            username: true,
            name: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.blogPost.findUnique({ where: { id } });
  }

  update(id: string, updateBlogPostDto: UpdateBlogPostDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authorId, ...data } = updateBlogPostDto;
    return this.prisma.blogPost.update({
      where: { id },
      data: data,
    });
  }

  remove(id: string) {
    return this.prisma.blogPost.delete({ where: { id } });
  }
}
