// server/src/app.module.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "โมดูลหลัก" (AppModule) หรือ "กล่องเครื่องมือที่ใหญ่ที่สุด"
 *
 * นี่คือ "ไฟล์แรก" ที่ Nest.js จะอ่าน (หลังจาก `main.ts`)
 * หน้าที่ของมันคือ "เชื่อมต่อ" ระบบหลักๆ (เช่น Database, .env)
 * และ "นำเข้า" (Import) "กล่องเครื่องมือย่อย" (Feature Modules) ทั้งหมด
 * (Products, Users, Auth, Orders) มารวมกัน
 * -----------------------------------------------------------------------------
 */

import { Module } from '@nestjs/common';
// (Import "เครื่องมือ" อ่าน .env)
import { ConfigModule } from '@nestjs/config';
// (Import "เครื่องมือ" เชื่อมต่อ MongoDB)
import { MongooseModule } from '@nestjs/mongoose';
// (Import "กล่องย่อย" ทั้งหมด)
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module'; // 1. Import (กล่อง User)
import { AuthModule } from './auth/auth.module'; // 2. Import (กล่อง Auth)
import { OrdersModule } from './orders/orders.module';

@Module({
  // ---------------------------------------------------------------------------
  // (ส่วน "ยืมเครื่องมือ" และ "เชื่อมต่อระบบหลัก")
  // ---------------------------------------------------------------------------
  imports: [
    // 1. "เชื่อมต่อ" ระบบ .env (ConfigModule)
    ConfigModule.forRoot({
      isGlobal: true, // (ตั้งค่า: "จงทำให้ .env (ConfigService) นี้")
      // ("สามารถถูกเรียกใช้ได้จาก "ทุกกล่อง" (Global))")
      // (โดยไม่ต้อง Import ConfigModule ในกล่องย่อยๆ อีก)
    }), // 2. "เชื่อมต่อ" ฐานข้อมูล MongoDB (MongooseModule)

    // (นี่คือการ "เชื่อมต่อหลัก" (Root Connection) ไปยัง Database)
    MongooseModule.forRoot(
      // (อ่าน "ที่อยู่" Database จาก .env ที่ชื่อ MONGODB_URI)
      // (ถ้าหา .env ไม่เจอ -> ให้ใช้ "ที่อยู่สำรอง" (localhost) นี้แทน)
      process.env.MONGODB_URI || 'mongodb://localhost:27017/computer_store',
    ), // 3. "เสียบปลั๊ก" (Import) "กล่องเครื่องมือย่อย" ทั้งหมด

    // (เมื่อ Import มาแล้ว Nest.js จะรู้จัก Controller, Service, Schema)
    // (ที่อยู่ในกล่องย่อยๆ เหล่านี้ทั้งหมด)
    ProductsModule,
    UsersModule, // (เสียบปลั๊กกล่อง User)
    AuthModule, // (เสียบปลั๊กกล่อง Auth)
    OrdersModule, // (เสียบปลั๊กกล่อง Orders)
  ],

  // ---------------------------------------------------------------------------
  // (AppModule ที่ดี มักจะ "ว่างเปล่า" ใน 2 ช่องนี้)
  // (เพราะ Controller และ Service ควรจะไปอยู่ใน "กล่องย่อย" ของตัวเอง)
  // ---------------------------------------------------------------------------
  controllers: [], // (AppController มักถูกลบทิ้ง หรือเหลือไว้แค่ GetHello)
  providers: [], // (AppService มักถูกลบทิ้ง หรือเหลือไว้แค่ GetHello)
})
export class AppModule {}
