// server/src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// ยามคนนี้จะใช้กลยุทธ์ (strategy) ที่ชื่อ 'jwt'
// (ที่เราเพิ่งสร้างใน JwtStrategy)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
