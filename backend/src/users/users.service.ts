import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Seed an initial admin user if none exists
    const adminEmail = 'emmwaniki2004@gmail.com';
    const existingAdmin = await this.findByEmail(adminEmail);
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await this.prisma.user.create({
        data: {
          email: adminEmail,
          fullName: 'Admin User',
          role: 'ADMIN',
          passwordHash,
        },
      });
      console.log('Seeded default admin user');
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        phone: true,
        settings: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    fullName: string;
    role: 'ADMIN' | 'ADVOCATE' | 'SECRETARY';
    email: string;
    password?: string;
    phone?: string;
    settings?: any;
  }) {
    const passwordHash = await bcrypt.hash(data.password || 'welcome123', 10);
    return this.prisma.user.create({
      data: {
        fullName: data.fullName,
        role: data.role,
        email: data.email,
        passwordHash,
        phone: data.phone,
        settings: data.settings || {},
      },
    });
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }

  async clearRefreshToken(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async updateProfile(userId: number, data: { fullName?: string; phone?: string; settings?: any }) {
    // If settings are provided, we should probably merge them if they are complex, 
    // but for now simple overwrite of the provided keys is fine. 
    // Prisma Json update can be used.
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        settings: data.settings,
      },
    });
  }

  async updatePassword(userId: number, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  async update(id: number, data: { fullName?: string; role?: any; email?: string; phone?: string; isActive?: boolean }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async adminResetPassword(id: number, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }
}
