// server/src/auth/auth.module.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "โมดูล" (Module) หรือ "กล่องเครื่องมือ" ของระบบ Auth
 * หน้าที่ของ Module คือการ "รวบรวม" ทุกสิ่งที่เกี่ยวข้องกับ Auth มาไว้ด้วยกัน
 *
 * มันบอก Nest.js ว่า:
 * 1. "พนักงานต้อนรับ" (Controller) ของเราคือใคร? (AuthController)
 * 2. "ผู้เชี่ยวชาญ/คนทำงาน" (Providers/Services) ของเรามีใครบ้าง? (AuthService, JwtStrategy)
 * 3. เราต้อง "ยืม" เครื่องมือจาก "กล่องอื่น" (Modules อื่น) มาใช้หรือไม่? (UsersModule, JwtModule)
 * -----------------------------------------------------------------------------
 */

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // (ยืม "กล่อง" Users)
import { PassportModule } from '@nestjs/passport'; // (ยืม "กล่อง" Passport)
import { JwtModule } from '@nestjs/jwt'; // (ยืม "กล่อง" JWT)
import { ConfigModule, ConfigService } from '@nestjs/config'; // (ยืม "กล่อง" .env)

// 1. 🚨 Import "นักถอดรหัส" (JwtStrategy) 🚨
// (เพื่อที่เราจะลงทะเบียนมันเป็น Provider ได้)
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  // ---------------------------------------------------------------------------
  // (ส่วน "ยืมเครื่องมือ" จากกล่องอื่น)
  // ---------------------------------------------------------------------------
  imports: [
    // 1. "ยืม" UsersModule
    // (AuthService ต้องใช้ UsersService ในการ "ค้นหา" และ "สร้าง" user)
    UsersModule,

    // 2. "ยืม" PassportModule
    // (นี่คือ "กล่องเครื่องมือ" หลักที่จัดการ "ยาม" (Guards) และ "กลยุทธ์" (Strategies))
    PassportModule, // 3. "ยืม" และ "ตั้งค่า" JwtModule (กล่องสำหรับ "สร้าง" และ "อ่าน" Token)

    // 🚨 เราใช้ `.registerAsync` (แบบไม่ซิงโครนัส)
    // "เหตุผล:" เราไม่สามารถอ่าน `process.env.JWT_SECRET` ได้ทันที
    // เราต้อง "รอ" ให้ `ConfigModule` (ตัวอ่าน .env) โหลดเสร็จก่อน
    JwtModule.registerAsync({
      imports: [ConfigModule], // (บอกว่า JwtModule ต้อง "รอ" ConfigModule)
      // (useFactory คือ "โรงงาน" ที่จะทำงานหลังจาก imports โหลดเสร็จ)
      useFactory: (configService: ConfigService) => ({
        // 3.1 🚨 อ่าน "กุญแจลับ" จาก .env (ที่ ConfigService อ่านมา)
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        // 3.2 ตั้งค่า Token: ให้มีอายุ 1 วัน
        signOptions: { expiresIn: '1d' },
      }),
      // (บอก Nest.js ว่าต้อง "ฉีด" ConfigService เข้ามาใน useFactory)
      inject: [ConfigService],
    }),
  ],

  // ---------------------------------------------------------------------------
  // (ส่วน "คนทำงาน" หรือ "ผู้เชี่ยวชาญ" ภายในกล่องนี้)
  // ---------------------------------------------------------------------------
  providers: [
    // 1. "คนทำงานหลัก" (AuthService)
    // (ทำหน้าที่ Login, Register, สร้าง Token)
    AuthService,

    // 2. 🚨 "นักถอดรหัส" (JwtStrategy) 🚨
    // (เรา "ลงทะเบียน" JwtStrategy ไว้ในกล่องนี้)
    // (เพื่อให้ PassportModule (ใน imports) สามารถ "ค้นหา" และ "เรียกใช้" มันได้
    // เมื่อไหร่ก็ตามที่ `JwtAuthGuard` ทำงาน)
    JwtStrategy,
  ],

  // ---------------------------------------------------------------------------
  // (ส่วน "พนักงานต้อนรับ" หรือ "ประตูหน้าบ้าน")
  // ---------------------------------------------------------------------------
  controllers: [AuthController],
})
export class AuthModule {}
