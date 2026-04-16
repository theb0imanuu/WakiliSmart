import { Controller, Get, Post, Request, Res, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any, @Res({ passthrough: true }) response: Response) {
    const tokens = await this.authService.login(req.user);
    
    response.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { message: 'Success', user: tokens.user };
  }

  @Post('refresh')
  async refresh(@Request() req: any, @Res({ passthrough: true }) response: Response) {
    const refreshToken = req.cookies['refresh_token'];
    
    // We expect the JWT middleware/strategy or a manual check to extract user_id. 
    // Wait, the client only sends the cookie. We need to decode the token to find the userId.
    if (!refreshToken) {
      throw new HttpException('No refresh token found', HttpStatus.UNAUTHORIZED);
    }

    // A hacky way to decode the unverified token to get the user ID, 
    // since we verify the signature in the refreshTokens service method via the DB.
    try {
      const base64Url = refreshToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decodedPayload = JSON.parse(jsonPayload);
      
      const tokens = await this.authService.refreshTokens(decodedPayload.sub, refreshToken);
      if (!tokens) {
        throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
      }

      response.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });

      response.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { message: 'Tokens refreshed' };
    } catch(err) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('logout')
  async logout(@Request() req: any, @Res({ passthrough: true }) response: Response) {
    const accessToken = req.cookies['access_token'];
    
    if (accessToken) {
      try {
        // We decode without verification to get the ID just for clearing the DB,
        // because we are logging out anyway.
        const base64Url = accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decodedPayload = JSON.parse(jsonPayload);
        
        if (decodedPayload.sub) {
          await this.authService.logout(decodedPayload.sub);
        }
      } catch (err) {
        // Ignore errors during ID extraction
      }
    }
    
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    return req.user;
  }
}

