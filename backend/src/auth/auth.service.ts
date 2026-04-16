import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.passwordHash) {
      const isMatch = await bcrypt.compare(pass, user.passwordHash);
      if (isMatch) {
        const { passwordHash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, email: user.email, sub: user.id, role: user.role };
    
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.usersService.saveRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
      },
    };
  }

  async logout(userId: number) {
    await this.usersService.clearRefreshToken(userId);
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || (!user as any).refreshToken) {
      return null;
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, (user as any).refreshToken);
    if (!refreshTokenMatches) {
      return null;
    }

    const payload = { username: user.username, email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    
    await this.usersService.saveRefreshToken(user.id, refresh_token);
    
    return {
      access_token,
      refresh_token,
    };
  }
}
