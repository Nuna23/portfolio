// server/src/auth/auth.controller.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "Controller" (ตัวควบคุม) หรือ "พนักงานต้อนรับ"
 * หน้าที่ของมันคือการ "จัดการ" HTTP requests ที่เข้ามา
 *
 * Controller "ไม่" ทำงานหนักเอง (เช่น ไม่เชื่อมต่อ Database, ไม่สร้าง Token)
 * หน้าที่ของมันคือ:
 * 1. กำหนด "เส้นทาง" (URL) เช่น /auth/register, /auth/login
 * 2. "ตรวจสอบ" ข้อมูลที่ส่งมา (ด้วย DTO และ ValidationPipe)
 * 3. "ส่งต่อ" งานไปให้ "ผู้เชี่ยวชาญ" (Service) ทำ
 * 4. "รับ" ผลลัพธ์จาก Service แล้ว "ส่งกลับ" (Response) ไปให้ client
 * -----------------------------------------------------------------------------
 */

// 1. Import "เครื่องมือ"
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
// 2. Import "ผู้เชี่ยวชาญ" (Service)
import { AuthService } from './auth.service';
// 3. Import "พิมพ์เขียว" (DTOs) สำหรับการตรวจสอบข้อมูล
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

// 4. "กำหนด" เส้นทางหลักของ Controller นี้
// (แปลว่าทุก Route ในไฟล์นี้จะขึ้นต้นด้วย /auth)
@Controller('auth')
export class AuthController {
  // 5. "ฉีด" (Inject) ผู้เชี่ยวชาญ (AuthService) เข้ามา
  // (Nest.js จะสร้าง AuthService ให้เรา แล้วส่งมาให้ตัวแปร authService นี้)
  constructor(private authService: AuthService) {} // 6. "กำหนด" เส้นทางย่อย (Endpoint) สำหรับการ "ลงทะเบียน"

  // (เมื่อ client ส่ง POST request มาที่ /auth/register -> ฟังก์ชันนี้จะทำงาน)
  @Post('register')
  // 7. "สั่ง" ให้ Nest.js "ตรวจสอบ" ข้อมูลที่ส่งมาใน @Body
  // (โดยใช้ "พิมพ์เขียว" CreateUserDto เป็น "กฎ")
  // (new ValidationPipe() คือ "ยาม" ที่จะตรวจข้อมูลให้เราอัตโนมัติ)
  register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    // 8. "ส่งต่อ" ข้อมูลที่ "ผ่านการตรวจสอบแล้ว" (createUserDto)
    // ให้ "ผู้เชี่ยวชาญ" (authService) ไปทำงาน (register)
    return this.authService.register(createUserDto);
  } // 9. "กำหนด" เส้นทางย่อย (Endpoint) สำหรับการ "ล็อกอิน"

  // (เมื่อ client ส่ง POST request มาที่ /auth/login -> ฟังก์ชันนี้จะทำงาน)
  @Post('login')
  // 10. "สั่ง" ให้ Nest.js "ตรวจสอบ" ข้อมูลที่ส่งมาใน @Body
  // (ครั้งนี้ใช้ "พิมพ์เขียว" LoginDto เป็น "กฎ")
  login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    // 11. "ส่งต่อ" ข้อมูล (loginDto) ให้ "ผู้เชี่ยวชาญ" (authService)
    // ไปทำงาน (login) และ "ส่งคืน" Token กลับไป
    return this.authService.login(loginDto);
  }
}

/*
 * -----------------------------------------------------------------------------
 * (สรุปการทำงาน)
 * 1. Client (Frontend) ส่ง POST request มาที่ /auth/login
 * 2. `AuthController` (ไฟล์นี้) รับเรื่อง
 * 3. `ValidationPipe` (ยาม) ทำงาน -> ตรวจสอบ @Body เทียบกับ `LoginDto`
 * 4. (ถ้าผ่าน) `AuthController` เรียก `this.authService.login(loginDto)`
 * 5. `AuthService` (อีกไฟล์) ทำงาน -> หา user, ตรวจรหัส, สร้าง JWT
 * 6. `AuthService` "ส่งคืน" (return) Token
 * 7. `AuthController` "ส่งคืน" (return) Token นั้นกลับไปให้ Client
 * -----------------------------------------------------------------------------
 */
