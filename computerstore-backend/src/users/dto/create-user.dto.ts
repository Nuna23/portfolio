// server/src/users/dto/create-user.dto.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "พิมพ์เขียว" (DTO - Data Transfer Object) สำหรับ "สมัครสมาชิก"
 *
 * มันกำหนด "กฎ" ทั้งหมดที่ข้อมูล (JSON) ที่ส่งมาจาก Frontend (หน้า Register)
 * ต้องปฏิบัติตาม
 *
 * `AuthController` (พนักงานต้อนรับ) จะใช้ "ยาม" (ValidationPipe)
 * เพื่อ "ตรวจสอบ" ข้อมูลที่ส่งมา เทียบกับ "กฎ" ในไฟล์นี้
 * -----------------------------------------------------------------------------
 */

// 1. Import "เครื่องมือตรวจสอบ" (กฎ) จาก class-validator
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// 2. "สร้างพิมพ์เขียว" (Class)
export class CreateUserDto {
  // 3. กฎสำหรับ 'name'
  @IsString() // (ต้องเป็น String)
  @IsNotEmpty() // (ห้ามว่าง)
  name: string; // 4. กฎสำหรับ 'email'

  @IsEmail() // (ต้องเป็น "รูปแบบ" อีเมลที่ถูกต้อง)
  @IsNotEmpty() // (ห้ามว่าง)
  email: string; // 5. กฎสำหรับ 'password'

  @IsString() // (ต้องเป็น String)
  // (ต้องมีความยาว "อย่างน้อย" 6 ตัวอักษร)
  @MinLength(6, {
    // (กำหนด "ข้อความ" ที่จะส่งกลับไป ถ้ากฎนี้ผิดพลาด)
    message: 'Password must be at least 6 characters long',
  })
  password: string;
}

/*
 * -----------------------------------------------------------------------------
 * (สรุปการทำงาน)
 * 1. Client (Frontend) ส่ง POST request มาที่ /auth/register
 * {
 * "name": "Test User",
 * "email": "test@example.com",
 * "password": "123" // 👈 (ผิดกฎ MinLength)
 * }
 * 2. `AuthController` (พนักงานต้อนรับ) รับเรื่อง
 * 3. `ValidationPipe` (ยาม) ทำงาน
 * 4. "ยาม" เอากฎ `CreateUserDto` นี้ไป "ตรวจสอบ" JSON
 * 5. "ยาม" พบว่า "password" (123) มีแค่ 3 ตัว -> ผิดกฎ @MinLength(6)
 * 6. "ยาม" จะ "โยน" Error 400 (Bad Request) กลับไปให้ Client ทันที
 * 7. (และส่งข้อความ: 'Password must be at least 6 characters long')
 * 8. โค้ดใน `AuthService` (ห้องครัว) จะ "ไม่" ถูกรันเลย
 * -----------------------------------------------------------------------------
 */
