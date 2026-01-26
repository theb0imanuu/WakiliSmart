import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
        where: {
            OR: [
                { email: createUserDto.email },
                { username: createUserDto.username }
            ]
        }
    });

    if (existingUser) {
        throw new ConflictException('Username or Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        name: createUserDto.name,
        password_hash: hashedPassword,
        role: createUserDto.role || 'SECRETARY',
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            name: true,
            role: true,
            created_at: true
        }
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            email: true,
            name: true,
            role: true,
            created_at: true
        }
    });
  }

  findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findByUsernameOrEmail(identifier: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
        ],
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    // Rename password to password_hash for prisma
    const { password, ...rest } = updateUserDto;
    const data: any = { ...rest };
    if (password) {
        data.password_hash = password;
    }

    return this.prisma.user.update({
      where: { id },
      data: data,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
