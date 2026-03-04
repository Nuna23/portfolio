// server/src/users/schemas/user.schema.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "พิมพ์เขียว" (Schema) สำหรับ "Collection" ที่ชื่อ 'users'
 * ในฐานข้อมูล MongoDB
 *
 * มันกำหนด "โครงสร้าง" ข้อมูลว่า "User (ผู้ใช้)" 1 คน
 * จะต้องเก็บข้อมูลอะไรบ้าง และมี "Logic" อะไรที่ต้อง "ทำงานอัตโนมัติ" (Hook)
 * ก่อนที่จะบันทึก (Save) ข้อมูล
 * -----------------------------------------------------------------------------
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt'; // (Import "เครื่องมือ" เข้ารหัส)

// `@Schema({ timestamps: true })`
// (คำสั่งพิเศษ: "จงเพิ่ม field `createdAt` และ `updatedAt` ให้อัตโนมัติ")
@Schema({ timestamps: true })
// (สืบทอด `Document` เพื่อให้ Class นี้มีพลังของ Mongoose เช่น .save(), .find())
export class User extends Document {
  @Prop({ required: true }) // (ห้ามว่าง)
  name: string;

  @Prop({
    required: true, // (ห้ามว่าง)
    unique: true, // (ห้ามซ้ำ - ห้ามมีอีเมลนี้ในระบบ)
    index: true, // ("สร้างดัชนี" -> เพื่อให้ "ค้นหา" ด้วยอีเมลได้เร็วขึ้น)
  })
  email: string;

  // 🚨 (สำคัญ) "การกำหนดบทบาท" (Role) 🚨
  @Prop({ default: 'customer' }) // (ถ้าไม่ระบุ "ค่าเริ่มต้น" คือ 'customer')
  role: string; // (บทบาท: 'customer' หรือ 'admin')

  @Prop({ required: true })
  password: string; // (นี่คือ "รหัสผ่านที่เข้ารหัสแล้ว" (Hashed) ที่จะเก็บลง DB)
}

// "แปลง" Class (พิมพ์เขียว) ให้เป็น Schema ที่ Mongoose ใช้งานได้
export const UserSchema = SchemaFactory.createForClass(User);

// ---------------------------------------------------------------------------
// 🚨 2. "Hook" (ตะขอ) หรือ "Logic อัตโนมัติ" 🚨
// ---------------------------------------------------------------------------
// `.pre<User>('save', ...)`
// นี่คือคำสั่ง "ดักจับ" (Intercept) เหตุการณ์
// แปลว่า: "ก่อน" (`pre`) ที่จะทำการ "บันทึก" (`save`) User
// (ทั้งการ "สร้างใหม่" (Create) หรือ "อัปเดต" (Update))
// "จงรันฟังก์ชันนี้ก่อน"
UserSchema.pre<User>('save', async function (next) {
  // (`this` ในที่นี้ หมายถึง "User" ที่กำลังจะถูกบันทึก)

  // 2.1 "ตรวจสอบ" ว่ามีการ "แก้ไข" field 'password' หรือไม่
  // (ถ้า User แค่ "เปลี่ยนชื่อ" -> `isModified('password')` จะเป็น `false`)
  if (!this.isModified('password')) {
    // (ถ้า "ไม่ได้" แก้ไขรหัสผ่าน -> "ข้าม" การเข้ารหัสไปเลย)
    return next();
  }

  // 2.2 (ถ้ามีการ "สร้าง" หรือ "เปลี่ยน" รหัสผ่าน -> ให้เข้ารหัสใหม่)
  try {
    // (สร้าง "เกลือ" (Salt) 10 รอบ - ยิ่งเยอะ ยิ่งถอดรหัสยาก)
    const salt = await bcrypt.genSalt(10);
    // (นำ "รหัสผ่านตัวอักษร" (this.password) มา "Hash" (ปั่น) กับ "เกลือ" (salt))
    this.password = await bcrypt.hash(this.password, salt);
    // (ตอนนี้ `this.password` ถูกเปลี่ยนเป็น "รหัสที่เข้ารหัสแล้ว")
    return next(); // (อนุญาตให้ "บันทึก" (Save) ต่อไปได้)
  } catch (err) {
    // 2.3 (ถ้าการ Hash เกิด Error -> ส่ง Error กลับไป และ "หยุด" การบันทึก)
    if (err instanceof Error) {
      return next(err);
    }
    return next(new Error(String(err)));
  }
});
