import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlogStatus } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  private slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

  async findAll(publishedOnly = true) {
    return this.prisma.blogPost.findMany({
      where: publishedOnly ? { status: BlogStatus.PUBLISHED } : {},
      include: {
        author: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async create(authorId: number, data: {
    title: string;
    content: string;
    imageUrl?: string;
    status: BlogStatus;
    tags?: any;
  }) {
    const slug = `${this.slugify(data.title)}-${Date.now()}`;
    return this.prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        imageUrl: data.imageUrl,
        status: data.status,
        tags: data.tags || [],
        authorId,
        publishedAt: data.status === BlogStatus.PUBLISHED ? new Date() : null,
      },
    });
  }

  async update(id: number, data: {
    title?: string;
    content?: string;
    imageUrl?: string;
    status?: BlogStatus;
    tags?: any;
  }) {
    const updateData: any = { ...data };
    
    if (data.title) {
      updateData.slug = `${this.slugify(data.title)}-${id}`;
    }

    if (data.status === BlogStatus.PUBLISHED) {
      const current = await this.findOne(id);
      if (!current.publishedAt) {
        updateData.publishedAt = new Date();
      }
    } else if (data.status === BlogStatus.DRAFT) {
      updateData.publishedAt = null;
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    return this.prisma.blogPost.delete({ where: { id } });
  }
}
