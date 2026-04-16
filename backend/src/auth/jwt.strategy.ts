import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        if (req && req.cookies && req.cookies['access_token']) {
          return req.cookies['access_token'];
        }
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'wakilismart_secret_key_change_me_in_prod',
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username, email: payload.email, role: payload.role };
  }
}
