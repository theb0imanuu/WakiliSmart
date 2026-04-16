import { Controller, Get, Post, Patch, Body, UseGuards, Request, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body()
    createUserDto: {
      fullName: string;
      email: string;
      role: UserRole;
      phone?: string;
      password?: string;
    },
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get('debug-ping')
  async ping() {
    return { status: 'ok', message: 'UsersController is alive' };
  }

  @Patch('profile')
  async updateProfile(
    @Request() req: any,
    @Body() data: { fullName?: string; phone?: string; settings?: any },
  ) {
    return this.usersService.updateProfile(req.user.id, data);
  }

  @Patch('change-password')
  async updatePassword(
    @Request() req: any,
    @Body() data: { newPassword: string },
  ) {
    return this.usersService.updatePassword(req.user.id, data.newPassword);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { fullName?: string; role?: UserRole; email?: string; phone?: string; isActive?: boolean },
  ) {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Post(':id/reset-password')
  @Roles(UserRole.ADMIN)
  async adminResetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { newPassword: string },
  ) {
    return this.usersService.adminResetPassword(id, data.newPassword);
  }
}
