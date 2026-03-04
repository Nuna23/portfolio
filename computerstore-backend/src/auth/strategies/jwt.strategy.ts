// server/src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string; // 'sub' คือ ID ผู้ใช้
  email: string;
  name: string;
  role: string; // 👈 (สำคัญ) เพิ่ม 'role' เข้ามา
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // ✅ 2. ลบ 'async' และใช้ 'JwtPayload' แทน 'any'
  validate(payload: JwtPayload) {
    return {
      _id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role, // 👈 (ปลอดภัยแล้ว)
    };
  }
}
