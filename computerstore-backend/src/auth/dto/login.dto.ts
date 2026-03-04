// server/src/auth/dto/login.dto.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "พิมพ์เขียว" หรือ "DTO" (Data Transfer Object)
 * DTO ทำหน้าที่เหมือน "แบบฟอร์ม" ที่กำหนดว่า ข้อมูลที่ส่งมาตอน "ล็อกอิน"
 * จะต้องมีหน้าตาอย่างไร และมีกฎอะไรบ้าง
 * * Nest.js จะใช้ไฟล์นี้คู่กับ ValidationPipe (ใน main.ts)
 * เพื่อ "ตรวจสอบข้อมูล" (Validate) ที่ client ส่งมาโดยอัตโนมัติ
 * -----------------------------------------------------------------------------
 */

// 1. Import "เครื่องมือตรวจสอบ"
// เรา Import 'decorators' (เช่น @IsEmail) มาจาก library ชื่อ class-validator
// Decorators เหล่านี้คือ "กฎ" ที่เราจะใช้แปะบน property ของเรา
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// 2. สร้าง "พิมพ์เขียว"
// เราสร้าง class ชื่อ LoginDto เพื่อเป็นพิมพ์เขียวสำหรับข้อมูลล็อกอิน
export class LoginDto {
  // 3. กฎสำหรับ 'email'
  // @IsEmail() คือกฎที่บอกว่า "ค่าที่ส่งมาใน field นี้ ต้องมี @ และ . (เป็นรูปแบบอีเมล)"
  @IsEmail()
  // @IsNotEmpty() คือกฎที่บอกว่า "field นี้ ห้ามเป็นค่าว่าง (empty string)"
  @IsNotEmpty()
  // ประกาศว่าต้องมี property ชื่อ email และต้องเป็นประเภท string
  email: string; // 4. กฎสำหรับ 'password'

  // @IsString() คือกฎที่บอกว่า "ค่าที่ส่งมา ต้องเป็นตัวอักษร (string)"
  @IsString()
  // @IsNotEmpty() คือกฎที่บอกว่า "field นี้ ห้ามเป็นค่าว่าง"
  @IsNotEmpty()
  password: string;
}

/*
 * -----------------------------------------------------------------------------
 * (สรุปการทำงาน)
 * เมื่อ client (Frontend) ส่ง JSON body มาที่ /auth/login:
 * {
 * "email": "test@example.com",
 * "password": "123"
 * }
 * * Nest.js จะเอา JSON นี้มาเทียบกับ "พิมพ์เขียว" (LoginDto) นี้
 * - ถ้า email ไม่ใช่รูปแบบอีเมล -> Nest.js จะโยน Error 400 (Bad Request)
 * - ถ้า password ว่างเปล่า -> Nest.js จะโยน Error 400 (Bad Request)
 * - ถ้าข้อมูลถูกต้อง -> Nest.js ถึงจะอนุญาตให้โค้ดใน Controller (AuthService.login) ทำงาน
 * -----------------------------------------------------------------------------
 */
