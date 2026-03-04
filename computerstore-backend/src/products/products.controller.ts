// server/src/products/products.controller.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * นี่คือ "Controller" (พนักงานต้อนรับ) สำหรับ "สินค้า" (Products)
 *
 * หน้าที่ของมันคือ "จัดการ" ทุกคำขอ (Request) ที่เกี่ยวกับสินค้า
 * และ "วางยาม" (Guards) ให้ถูกต้องในแต่ละประตู (Route)
 *
 * - "ประตู" ที่ "ลูกค้า" ใช้งานได้ (เช่น ดูสินค้าทั้งหมด, ดู 1 ชิ้น) -> จะ "ไม่" มียาม
 * - "ประตู" ที่ "แอดมิน" เท่านั้นที่ใช้ได้ (เช่น สร้าง, แก้ไข, ลบ) -> จะ "มียาม"
 * -----------------------------------------------------------------------------
 */

import {
  Controller,
  Get, // (สร้าง Route แบบ GET)
  Post, // (สร้าง Route แบบ POST)
  Body, // (ดึงข้อมูลจาก JSON body)
  Param, // (ดึงข้อมูลจาก URL param เช่น :id)
  Put, // (สร้าง Route แบบ PUT - สำหรับ Update)
  Delete, // (สร้าง Route แบบ DELETE)
  ValidationPipe, // (ยาม" ตรวจสอบ DTO)
  UseGuards, // ("เครื่องมือ" วางยาม)
} from '@nestjs/common';
import { ProductsService } from './products.service'; // (Import "ห้องครัว")
import { CreateProductDto } from './dto/create-product.dto'; // (Import "แบบฟอร์ม" สร้าง)
import { UpdateProductDto } from './dto/update-product.dto'; // (Import "แบบฟอร์ม" แก้ไข)
import { AdminGuard } from '../auth/guards/admin.guard'; // 1. Import "ยามด่าน 2" (ตรวจ Admin)
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // 2. Import "ยามด่าน 1" (ตรวจ Token)

// (กำหนดว่าทุก Route ในไฟล์นี้จะขึ้นต้นด้วย /products)
@Controller('products')
export class ProductsController {
  // (Inject "ห้องครัว" (ProductsService) เข้ามา)
  constructor(private readonly productsService: ProductsService) {} // --- 1. "สร้าง" สินค้า (Admin) ---
  // (POST /products)
  // 🚨 3. วางยาม 2 ด่าน: 1. ต้องล็อกอิน (Jwt) 2. ต้องเป็น Admin

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  // (ดึง body และ "ตรวจสอบ" ด้วย "แบบฟอร์ม" CreateProductDto)
  create(@Body(new ValidationPipe()) createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto); // (ส่งให้ "ห้องครัว" สร้าง)
  } // --- 2. "ดู" สินค้าทั้งหมด (สำหรับ "ลูกค้า" - Public) ---
  // (GET /products)
  // 🚨 (ประตูนี้ "ไม่" มียาม -> "ลูกค้า" ที่ไม่ได้ล็อกอินก็ดูได้)

  @Get()
  findAll() {
    // (เรียก "ห้องครัว" ฟังก์ชัน findAll (ที่อาจจะกรอง `isActive: true`))
    return this.productsService.findAll();
  } // --- 3. "ดู" สินค้าทั้งหมด (สำหรับ "แอดมิน") ---
  // (GET /products/all)
  // 🚨 4. วางยาม 2 ด่าน (Admin เท่านั้นที่ดูได้)

  @UseGuards(JwtAuthGuard, AdminGuard)
  // 🚨 5. สร้าง "ประตูใหม่" ชื่อ 'all'
  // (เพื่อให้ Admin เรียกดูสินค้า "ทั้งหมด" (รวมที่ซ่อนอยู่ `isActive: false`))
  // (ป้องกันไม่ให้ชนกับ `@Get()` ของลูกค้า)
  @Get('all')
  findAllForAdmin() {
    return this.productsService.findAllForAdmin();
  } // --- 4. "ดู" สินค้า 1 ชิ้น (สำหรับ "ลูกค้า" - Public) ---
  // (GET /products/:id) (เช่น /products/60f7e...)
  // 🚨 (ประตูนี้ "ไม่" มียาม -> "ลูกค้า" ดูรายละเอียดสินค้าได้)

  @Get(':id')
  findOne(@Param('id') id: string) {
    // (ดึง :id ออกมาจาก URL)
    return this.productsService.findOne(id); // (ส่งให้ "ห้องครัว" ค้นหา)
  } // --- 5. "แก้ไข" สินค้า (Admin) ---
  // (PUT /products/:id)
  // 🚨 6. วางยาม 2 ด่าน (Admin เท่านั้นที่แก้ไขได้)

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  update(
    @Param('id') id: string, // (ดึง "ID" ที่จะแก้)
    // (ดึง "ข้อมูลใหม่" ที่จะแก้ และ "ตรวจสอบ" ด้วย "แบบฟอร์ม" UpdateProductDto)
    // (ValidationPipe จะ "อนุญาต" ให้ส่งข้อมูลมาแค่บางช่องได้)
    @Body(new ValidationPipe()) updateDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateDto); // (ส่งให้ "ห้องครัว" อัปเดต)
  } // --- 6. "ลบ" สินค้า (Admin) ---
  // (DELETE /products/:id)
  // 🚨 7. วางยาม 2 ด่าน (Admin เท่านั้นที่ลบได้)

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    // (ดึง "ID" ที่จะลบ)
    return this.productsService.remove(id); // (ส่งให้ "ห้องครัว" ลบ)
  }
}
