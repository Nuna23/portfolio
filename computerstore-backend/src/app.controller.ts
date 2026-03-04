// server/src/app.controller.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "Controller" (พนักงานต้อนรับ) หลักของแอปพลิเคชัน
 *
 * มันคือ "ประตูหน้าบ้าน" ที่จัดการคำขอ (Request) ที่เข้ามายัง "Root URL"
 * (เช่น http://localhost:3000/ - ที่ไม่มี path ต่อท้าย)
 * -----------------------------------------------------------------------------
 */

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service'; // (Import "คนทำงาน" หรือ "สมอง")

// 1. "กำหนด" ว่านี่คือ Controller
// `@Controller()` (แบบว่างเปล่า)
// (หมายความว่า Controller นี้จะ "จัดการ" URL "ราก" (Root) หรือ "/")
@Controller()
export class AppController {
  // 2. "ฉีด" (Inject) "คนทำงาน" (AppService) เข้ามา
  constructor(private readonly appService: AppService) {} // 3. "กำหนด" เส้นทางย่อย (Endpoint)
  // `@Get()` (แบบว่างเปล่า)

  // (หมายความว่า "ฟังก์ชันนี้" (getHello) จะทำงาน
  // เมื่อมี "GET Request" ส่งมาที่ URL "ราก" ("/"))
  @Get()
  // (ฟังก์ชันนี้จะคืนค่าเป็น "string")
  getHello(): string {
    // 4. "ส่งต่อ" งานให้ "คนทำงาน"
    // (เรียกฟังก์ชัน getHello() จาก AppService)
    // (AppService (อีกไฟล์) ก็จะ return "Hello World!")
    return this.appService.getHello();
  }
}

/*
 * -----------------------------------------------------------------------------
 * (สรุปการทำงาน)
 * 1. Client (เช่น เว็บเบราว์เซอร์) เปิด http://localhost:3000/ (เป็น GET Request)
 * 2. Nest.js "ค้นหา" Controller ที่ตรงกับ "/" -> (เจอ `@Controller()` นี้)
 * 3. Nest.js "ค้นหา" Method ที่ตรงกับ "GET" -> (เจอ `@Get()` นี้)
 * 4. `AppController` (ไฟล์นี้) รันฟังก์ชัน `getHello()`
 * 5. `getHello()` เรียก `this.appService.getHello()`
 * 6. `AppService` (อีกไฟล์) ตอบกลับมาว่า "Hello World!"
 * 7. `AppController` (ไฟล์นี้) ส่ง "Hello World!" กลับไปให้ Client
 * -----------------------------------------------------------------------------
 */
