// server/src/products/schemas/product.schema.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "พิมพ์เขียว" (Schema) สำหรับ "Collection" ที่ชื่อ 'products'
 * ในฐานข้อมูล MongoDB
 *
 * มันกำหนด "โครงสร้าง" ข้อมูลว่า "Product (สินค้า)" 1 ชิ้น
 * จะต้องเก็บข้อมูลอะไรบ้าง, แต่ละช่องมีกฎอะไร (เช่น ห้ามว่าง, ห้ามซ้ำ)
 * และมี "พิมพ์เขียวย่อย" (Specs) "ฝัง" (Embed) อยู่ข้างใน
 * -----------------------------------------------------------------------------
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// ---------------------------------------------------------------------------
// 1. "พิมพ์เขียวย่อย" (Sub-Schema) สำหรับ "สเปค" (Specs)
// ---------------------------------------------------------------------------
// `@Schema({ _id: false })`
// (ตั้งค่า "ห้าม" สร้าง _id ให้อัตโนมัติ สำหรับ "พิมพ์เขียวย่อย" นี้)
// (เพราะเราไม่ต้องการให้ "specs" object มี _id ของตัวเอง)
@Schema({ _id: false })
export class Specs {
  @Prop()
  cpu: string;
  @Prop()
  ram: string;
  @Prop()
  storage: string;
  @Prop()
  gpu: string;
  @Prop()
  display: string;
}

// ---------------------------------------------------------------------------
// 2. "พิมพ์เขียวหลัก" (Main Schema) สำหรับ "สินค้า" (Product)
// ---------------------------------------------------------------------------
// `@Schema({ timestamps: true })`
// (คำสั่งพิเศษ: "จงเพิ่ม field `createdAt` และ `updatedAt` ให้อัตโนมัติ")
@Schema({ timestamps: true })
// (สืบทอด `Document` เพื่อให้ Class นี้มีพลังของ Mongoose เช่น .save(), .find())
export class Product extends Document {
  // `@Prop(...)` คือการกำหนด "กฎ" ของ Field นี้ใน Database
  @Prop({
    required: true, // (ห้ามว่าง)
    unique: true, // (ห้ามซ้ำ - ชื่อสินค้าต้องไม่ซ้ำกัน)
    trim: true, // (ตัดช่องว่างหน้า-หลังอัตโนมัติ)
  })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  brand: string;

  @Prop({
    required: true, // (ห้ามว่าง)
    index: true, // (สำคัญ!) "สร้างดัชนี" ให้ field นี้
    // (เพื่อให้การ "ค้นหา" หรือ "กรอง" ด้วย category ทำได้เร็วขึ้น)
  })
  category: string; // 🚨 (สำคัญ) "การฝัง" พิมพ์เขียวย่อย (Embedding) 🚨
  // (บอก Mongoose ว่า `specs` field นี้ ไม่ใช่ String/Number ธรรมดา)

  // (แต่เป็น "Object" ที่ต้องมีโครงสร้างตาม "พิมพ์เขียวย่อย" `Specs`)
  @Prop({ type: Specs, required: true })
  specs: Specs;

  @Prop({ default: 0 }) // (ถ้าไม่ระบุ "ค่าเริ่มต้น" คือ 0)
  stock: number; // `[String]` คือการบอก Mongoose ว่า "นี่คือ Array ของ String"

  @Prop([String])
  imageUrls: string[];

  @Prop({ default: true }) // (ถ้าไม่ระบุ "ค่าเริ่มต้น" คือ true)
  isActive: boolean; // (ใช้สำหรับ "ซ่อน" สินค้า (Soft Delete) โดยไม่ต้องลบจริง)
}

// 3. "แปลง" Class (พิมพ์เขียว) ให้เป็น Schema ที่ Mongoose ใช้งานได้
// (นี่คือสิ่งที่เราจะ `export` ไปให้ `products.module.ts` ใช้)
export const ProductSchema = SchemaFactory.createForClass(Product);
