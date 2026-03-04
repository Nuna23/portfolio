// server/src/users/users.service.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "Service" (บริการ) หรือ "คนทำงาน" ของระบบ Users
 *
 * นี่คือ "คนทำงานจริง" ที่ "คุยกับ Database (MongoDB)" โดยตรง
 * หน้าที่ของมันคือการ "จัดการ" (Manage) ข้อมูลใน Collection 'users'
 *
 * (ในโปรเจกต์นี้) Service นี้ "ไม่" ถูกเรียกโดย Controller โดยตรง
 * แต่ถูก "ยืม" ไปใช้โดย `AuthService` (สมองของระบบ Auth)
 * -----------------------------------------------------------------------------
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // (เครื่องมือ "ฉีด" Model)
import { Model } from 'mongoose'; // (พิมพ์เขียว Model)
import { User } from './schemas/user.schema'; // (พิมพ์เขียว DB 'users')
import { CreateUserDto } from './dto/create-user.dto'; // (พิมพ์เขียว "ข้อมูล" สร้าง)

@Injectable()
export class UsersService {
  // 1. "ฉีด" (Inject) Model ที่ต้องใช้เข้ามา
  // (เราต้องใช้ User Model เพื่อคุยกับ Collection 'users' ใน DB)
  constructor(@InjectModel(User.name) private userModel: Model<User>) {} // 2. "ฟังก์ชันค้นหา User ด้วยอีเมล"
  // (ถูกเรียกใช้โดย `AuthService` ตอน "Login" และ "Register")

  async findByEmail(email: string): Promise<User | null> {
    // (ใช้ `findOne` เพื่อค้นหาเอกสาร "ตัวแรก" ที่ field `email` ตรงกัน)
    // (ถ้าหาไม่เจอ จะคืนค่า `null`)
    return this.userModel.findOne({ email }).exec();
  } // 3. "ฟังก์ชันสร้าง User"
  // (ถูกเรียกใช้โดย `AuthService` ตอน "Register")

  async create(createUserDto: CreateUserDto): Promise<User> {
    // (คอมเมนต์ของคุณถูกต้อง 100% ครับ)
    // (password จะถูก hash (เข้ารหัส) โดยอัตโนมัติ)
    // (จาก "Hook" (`pre-save`) ที่เราเขียนไว้ใน `user.schema.ts`)

    // (สร้าง Instance ของ User (ใน Memory) จากข้อมูล DTO ที่ผ่านการตรวจสอบแล้ว)
    const newUser = new this.userModel(createUserDto);

    // (สั่ง "บันทึก" (Save) ลง Database จริงๆ)
    // (Mongoose จะ "ดักจับ" (Intercept) เหตุการณ์ .save() นี้)
    // (และรัน "Hook" (pre-save) เพื่อเข้ารหัสรหัสผ่าน "ก่อน" ที่จะบันทึกจริง)
    return newUser.save();
  }
}

/*
 * -----------------------------------------------------------------------------
 * (สรุปการทำงาน)
 * 1. `AuthService` (สมอง Auth) อยาก "สมัครสมาชิก" (Register)
 * 2. `AuthService` เรียก `this.usersService.findByEmail(...)` (ไฟล์นี้) เพื่อเช็กอีเมลซ้ำ
 * 3. `AuthService` เรียก `this.usersService.create(...)` (ไฟล์นี้)
 * 4. `UsersService` (ไฟล์นี้) สั่ง `newUser.save()`
 * 5. `UserSchema` (อีกไฟล์) "ดักจับ" `.save()` -> ทำการ "Hash" รหัสผ่าน
 * 6. `UsersService` (ไฟล์นี้) "ส่งคืน" User ที่สร้างเสร็จ (พร้อมรหัสที่ Hash แล้ว) กลับไป
 * -----------------------------------------------------------------------------
 */
