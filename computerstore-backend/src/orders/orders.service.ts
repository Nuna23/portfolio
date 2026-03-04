// server/src/orders/orders.service.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "Service" (บริการ) หรือ "ห้องครัว" (Kitchen) ของระบบ Orders
 *
 * นี่คือ "คนทำงานจริง" ที่ Controller (พนักงานต้อนรับ) เรียกใช้
 * หน้าที่ของมันคือ "คุยกับ Database" (MongoDB) โดยตรง
 *
 * หน้าที่หลัก:
 * 1. "สร้าง" ออเดอร์ (Create) -> ต้องคำนวณราคาสินค้าใหม่ที่ Backend เพื่อกันโกง
 * 2. "ค้นหา" ออเดอร์ของฉัน (findMyOrders)
 * 3. "ค้นหา" ออเดอร์ทั้งหมด (findAllOrders) -> สำหรับ Admin
 * 4. "ค้นหา" ออเดอร์ 1 ชิ้น (findOrderById) -> สำหรับดูรายละเอียด
 * -----------------------------------------------------------------------------
 */

import {
  Injectable,
  BadRequestException, // (Error 400 - ข้อมูลที่ส่งมาไม่ถูกต้อง)
  NotFoundException, // (Error 404 - หาไม่เจอ)
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // (เครื่องมือ "ฉีด" Model)
import { Model } from 'mongoose'; // (พิมพ์เขียว Model)
import { Order } from './schemas/order.schema'; // (พิมพ์เขียว DB 'orders')
import { CreateOrderDto } from './dto/create-order.dto'; // (พิมพ์เขียว "ข้อมูล" ที่ส่งมา)
import { Product } from '../products/schemas/product.schema'; // (พิมพ์เขียว DB 'products')

@Injectable()
export class OrdersService {
  // 1. "ฉีด" (Inject) Models ที่ต้องใช้เข้ามา
  // (เราต้องใช้ 2 Models: Order (เพื่อสร้าง) และ Product (เพื่อเช็คราคา))
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  // 2. "ฟังก์ชันสร้างออเดอร์" (ถูกเรียกโดย OrdersController)
  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    // 2.1 🚨 (สำคัญมาก) "คำนวณราคารวม" ที่ Backend 🚨
    // "ห้าม" เชื่อถือราคารวม (totalPrice) ที่ Frontend ส่งมาเด็ดขาด
    // (Client อาจจะแก้ราคาสินค้าในตะกร้าเหลือ 1 บาท)
    // เราต้อง "วนลูป" สินค้าในตะกร้า (items) และ "ดึงราคาจริง" จาก Database
    let calculatedTotalPrice = 0;
    for (const item of createOrderDto.items) {
      // (ดึง "สินค้าจริง" จาก DB)
      const product = await this.productModel.findById(item.productId);
      // (ถ้าสินค้าไม่มีในระบบ (เช่น เพิ่งถูกลบ) -> โยน Error)
      if (!product) {
        throw new BadRequestException(
          `Product with ID ${item.productId} not found`,
        );
      }
      // (บวกราคา: ราคาจริงจาก DB * จำนวนที่สั่ง)
      calculatedTotalPrice += product.price * item.quantity;
    }

    // 2.2 "สร้าง" ออเดอร์ใหม่ใน Memory
    const newOrder = new this.orderModel({
      ...createOrderDto, // (คัดลอก `items` และ `shippingAddress` ที่ Client ส่งมา)
      user: userId, // (เพิ่ม `userId` (เจ้าของ) ที่เราดึงมาจาก Token)
      totalPrice: calculatedTotalPrice, // (ใช้ "ราคาที่ Backend คำนวณ" เท่านั้น)
      status: 'Pending', // (ตั้งสถานะเริ่มต้น)
    });

    // 2.3 "บันทึก" ลง Database จริง
    return newOrder.save();
  }

  // 3. "ฟังก์ชันค้นหาออเดอร์ของฉัน"
  async findMyOrders(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ user: userId }) // (ค้นหาเฉพาะออเดอร์ที่ "user" field ตรงกับ userId นี้)
      .sort({ createdAt: -1 }) // (เรียงจาก "ใหม่สุด" ไป "เก่าสุด")
      .exec();
  }

  // 4. "ฟังก์ชันค้นหาออเดอร์ทั้งหมด" (สำหรับ Admin)
  async findAllOrders(): Promise<Order[]> {
    return (
      this.orderModel
        .find() // (ค้นหา "ทั้งหมด" โดยไม่กรอง)
        .sort({ createdAt: -1 }) // (เรียงจาก "ใหม่สุด")
        // 4.1 🚨 (สำคัญ) "เชื่อม" Collection 🚨
        // `.populate('user', 'name email')`
        // (สั่ง Mongoose ว่า "field 'user' ที่เป็น ObjectId น่ะ")
        // ("จงวิ่งไปที่ Collection 'users' เอา ObjectId นั้นไปค้นหา")
        // ("แล้วดึงแค่ 'name' กับ 'email' กลับมาแทนที่ ObjectId นั้น")
        .populate('user', 'name email')
        .exec()
    );
  } // 5. "ฟังก์ชันค้นหาออเดอร์ 1 ชิ้น" (สำหรับดูรายละเอียด)

  async findOrderById(orderId: string): Promise<Order> {
    const order = await this.orderModel
      .findById(orderId) // (ค้นหาด้วย ID ของออเดอร์)
      // 5.1 (Populate user เหมือนเดิม)
      .populate('user', 'name email')
      // 5.2 🚨 (Populate แบบซ้อน) 🚨
      // `populate('items.productId', 'name price')`
      // (สั่ง Mongoose ว่า "จงเข้าไปดูใน Array 'items' นะ")
      // ("แล้วใน 'items' แต่ละตัว ให้ดู field 'productId'")
      // ("แล้วเอา 'productId' นั้น วิ่งไป Collection 'products'")
      // ("แล้วดึง 'name' กับ 'price' กลับมาแทนที่ ObjectId นั้น")
      .populate('items.productId', 'name price')
      .exec();

    // 5.3 (ถ้าหาไม่เจอ -> โยน Error 404)
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return order;
  }
}
