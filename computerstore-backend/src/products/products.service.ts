// server/src/products/products.service.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "Service" (บริการ) หรือ "ห้องครัว" (Kitchen) ของระบบ Products
 *
 * นี่คือ "คนทำงานจริง" ที่ Controller (พนักงานต้อนรับ) เรียกใช้
 * หน้าที่ของมันคือ "คุยกับ Database" (MongoDB) โดยตรง
 *
 * หน้าที่หลัก (CRUD):
 * 1. "สร้าง" สินค้า (Create)
 * 2. "ค้นหา" สินค้า (Read) -> แยก 3 แบบ (ทั้งหมด(Admin), ทั้งหมด(Customer), 1 ชิ้น)
 * 3. "อัปเดต" สินค้า (Update)
 * 4. "ลบ" สินค้า (Delete)
 * -----------------------------------------------------------------------------
 */

import { Injectable, NotFoundException } from '@nestjs/common'; // (Error 404)
import { InjectModel } from '@nestjs/mongoose'; // (เครื่องมือ "ฉีด" Model)
import { Model } from 'mongoose'; // (พิมพ์เขียว Model)
import { Product } from './schemas/product.schema'; // (พิมพ์เขียว DB 'products')
import { CreateProductDto } from './dto/create-product.dto'; // (พิมพ์เขียว "ข้อมูล" สร้าง)
import { UpdateProductDto } from './dto/update-product.dto'; // (พิมพ์เขียว "ข้อมูล" แก้ไข)

@Injectable()
export class ProductsService {
  // 1. "ฉีด" (Inject) Model ที่ต้องใช้เข้ามา
  // (เราต้องใช้ ProductModel เพื่อคุยกับ Collection 'products' ใน DB)
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {} // 2. "ฟังก์ชันสร้างสินค้า" (ถูกเรียกโดย ProductsController)

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // (สร้าง Instance ของ Product (ใน Memory) จากข้อมูล DTO ที่ผ่านการตรวจสอบแล้ว)
    const newProduct = new this.productModel(createProductDto);
    // (สั่ง "บันทึก" (Save) ลง Database จริงๆ)
    return newProduct.save();
  } // 3. "ฟังก์ชันค้นหาสินค้าทั้งหมด" (สำหรับ "ลูกค้า" - Public)

  async findAll(): Promise<Product[]> {
    // (ค้นหา "ทั้งหมด" *แต่* "กรอง" เอาเฉพาะสินค้าที่ `isActive: true` (ที่เปิดขาย))
    return this.productModel.find({ isActive: true }).exec();
  } // 4. "ฟังก์ชันค้นหาสินค้าทั้งหมด" (สำหรับ "แอดมิน")

  async findAllForAdmin(): Promise<Product[]> {
    // (ค้นหา "ทั้งหมด" โดย "ไม่กรอง" `isActive`)
    // (เพื่อให้ Admin เห็นสินค้าทั้งหมดในระบบ แม้แต่สินค้าที่ "ซ่อน" อยู่)
    return this.productModel.find().exec();
  } // 5. "ฟังก์ชันค้นหาสินค้า 1 ชิ้น" (Public)

  async findOne(id: string): Promise<Product> {
    // (ค้นหาด้วย Primary Key (_id))
    const product = await this.productModel.findById(id).exec();

    // (ถ้า `product` เป็น `null` (หาไม่เจอ) -> โยน Error 404)
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    // (ถ้าเจอ -> ส่งคืน)
    return product;
  } // 6. "ฟังก์ชันอัปเดตสินค้า" (Admin)

  async update(id: string, updateDto: UpdateProductDto): Promise<Product> {
    // (ค้นหา BSON ที่มี `id` นี้ และ "อัปเดต" ด้วยข้อมูล `updateDto`)
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateDto, {
        new: true, // 🚨 (คำสั่งพิเศษ) "จงส่งคืนเอกสาร *ตัวใหม่* ที่อัปเดตแล้ว"
        // (ถ้าไม่มีคำสั่งนี้ มันจะส่งคืน "ตัวเก่า" ก่อนอัปเดต)
      })
      .exec();

    // (ถ้าหา `id` ที่จะอัปเดตไม่เจอ -> โยน Error 404)
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  } // 7. "ฟังก์ชันลบสินค้า" (Admin)

  async remove(id: string): Promise<{ message: string }> {
    // (ค้นหา BSON ที่มี `id` นี้ และ "ลบ" ออกจาก Database จริงๆ (Hard Delete))
    const result = await this.productModel.findByIdAndDelete(id).exec();

    // (ถ้า `result` เป็น `null` (หา `id` ที่จะลบไม่เจอ) -> โยน Error 404)
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // (ถ้าลบสำเร็จ -> ส่งข้อความยืนยันกลับไป)
    return { message: 'Product deleted successfully' };
  }
}
