// server/src/auth/guards/admin.guard.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "ยาม" (Guard) ที่ชื่อ "AdminGuard"
 * หน้าที่ของยามคนนี้คือ "ตรวจสิทธิ์" (Authorization)
 *
 * **"ยาม" คนนี้จะทำงานเป็น "ด่านที่ 2" เสมอ**
 * 1. ด่านที่ 1 (JwtAuthGuard): ตรวจสอบ Token ว่า "บัตรผ่าน" (Token) นี้ถูกต้องหรือไม่
 * -> ถ้าถูกต้อง JwtAuthGuard จะไป "ดึงข้อมูล user" มาแปะไว้ใน `request.user`
 * 2. ด่านที่ 2 (AdminGuard): (คือไฟล์นี้) จะมา "อ่าน" `request.user` ที่ด่านที่ 1 แปะไว้
 * -> เพื่อดูว่า user คนนี้มี "ตำแหน่ง" (role) เป็น 'admin' หรือไม่
 * -----------------------------------------------------------------------------
 */

import {
  Injectable, // (บอก Nest.js ว่า class นี้สามารถ "ฉีด" (Inject) เข้าไปใช้ที่อื่นได้)
  CanActivate, // (นี่คือ "พิมพ์เขียว" (Interface) ที่ "ยาม" ทุกคนต้องมี)
  ExecutionContext, // (นี่คือ "สภาพแวดล้อม" ของ request ที่เข้ามา เช่น request, response)
  ForbiddenException, // (นี่คือ "ข้อผิดพลาด" ที่เราจะโยน ถ้าไม่ได้รับอนุญาต)
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express'; // (พิมพ์เขียว Request พื้นฐานจาก Express)

// (นี่คือ "พิมพ์เขียว" ที่เราสร้างขึ้นเอง เพื่อบอก TypeScript ว่า)
// (ข้อมูล user ที่เราจะไปอ่านจาก request.user หน้าตาเป็นยังไง)
interface UserPayload {
  _id: string;
  email: string;
  name: string;
  role: string; // 👈 (นี่คือ property ที่เราสนใจ)
}

// (นี่คือการ "อัปเกรด" พิมพ์เขียว Request เดิมของ Express)
// (เราบอกว่า Request ของเราจะมีหน้าตาเหมือน Request ปกติ)
// (แต่ "เพิ่มเติม" คือมี property `user` ที่มีหน้าตาแบบ `UserPayload` แปะอยู่)
interface RequestWithUser extends Request {
  user: UserPayload;
}

@Injectable() // (บอกว่านี่คือ Service ที่ Inject ได้)
// (ประกาศว่า AdminGuard เป็น "ยาม" โดยการ implements Interface `CanActivate`)
export class AdminGuard implements CanActivate {
  // (นี่คือ "ฟังก์ชันบังคับ" ที่ยามทุกคนต้องมี)
  // (Nest.js จะรันฟังก์ชันนี้อัตโนมัติเมื่อ Guard ทำงาน)
  // (ถ้า return true = "อนุญาตให้ผ่าน", ถ้า return false หรือ throw error = "ไม่อนุญาต")
  canActivate(
    context: ExecutionContext, // (ข้อมูลแวดล้อมของ request นี้)
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. "ดึง" request ออกมาจาก "สภาพแวดล้อม"
    // (เราใช้ <RequestWithUser> เพื่อ "บอก" TypeScript ว่า request ที่ได้มา)
    // (เป็นเวอร์ชัน "อัปเกรด" ที่มี .user แปะอยู่)
    const request = context.switchToHttp().getRequest<RequestWithUser>(); // 2. "อ่าน" user ที่ถูกแปะไว้โดย JwtAuthGuard (ด่านที่ 1)

    const user = request.user; // (ตอนนี้ TypeScript รู้จัก `user` และ `user.role` แล้ว)
    // 3. "ตรวจสอบ" (นี่คือ Logic หลักของยามคนนี้)

    // "ถ้ามี user จริง และ user.role เท่ากับ 'admin' เป๊ะๆ"
    if (user && user.role === 'admin') {
      return true; // (อนุญาตให้ผ่านด่านนี้ไปได้)
    } // 4. "ปฏิเสธ"

    // (ถ้าไม่เข้าเงื่อนไขข้างบน เช่น user ไม่มี, role เป็น 'customer', ฯลฯ)
    // (เราจะ "โยน" Error 403 Forbidden ออกไป)
    throw new ForbiddenException('Access denied. Admin role required.');
  }
}

/*
 * -----------------------------------------------------------------------------
 * (สรุปการทำงาน)
 * 1. ใน Controller (เช่น ProductsController) เราจะเรียกใช้ยามแบบนี้:
 * @UseGuards(JwtAuthGuard, AdminGuard) // 👈 (ด่าน 1, ด่าน 2)
 * @Get('all')
 *
 * 2. เมื่อมีคนเรียก /products/all
 * 3. Nest.js จะเรียก JwtAuthGuard (ด่าน 1) -> ตรวจ Token -> แปะ `request.user`
 * 4. Nest.js จะเรียก AdminGuard (ด่าน 2) -> อ่าน `request.user.role`
 * 5. ถ้า role = 'admin' -> อนุญาตให้ Controller ทำงาน
 * 6. ถ้า role != 'admin' -> โยน Error 403 Forbidden (Access denied) ทันที
 * -----------------------------------------------------------------------------
 */
