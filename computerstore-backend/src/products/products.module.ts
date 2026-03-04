// server/src/products/products.module.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "โมดูล" (Module) หรือ "กล่องเครื่องมือ" ของระบบ Products
 *
 * หน้าที่ของมันคือการ "รวบรวม" ทุกสิ่งที่เกี่ยวข้องกับ "สินค้า" มาไว้ด้วยกัน
 * และบอก Nest.js ว่า:
 * 1. "พนักงานต้อนรับ" (Controller) คือใคร? (ProductsController)
 * 2. "คนทำงาน/ห้องครัว" (Service) คือใคร? (ProductsService)
 * 3. เราต้อง "ยืม" เครื่องมือจาก "กล่องอื่น" มาใช้หรือไม่? (AuthModule, MongooseModule)
 * -----------------------------------------------------------------------------
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // (Import "เครื่องมือ" คุยกับ DB)
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
// 1. Import "พิมพ์เขียว" (Schema) ของ Product
import { Product, ProductSchema } from './schemas/product.schema';
// 2. Import "กล่องเครื่องมือ" Auth
// (เราต้องใช้ "ยาม" (Guards) จากกล่องนี้)
import { AuthModule } from '../auth/auth.module';

@Module({
  // ---------------------------------------------------------------------------
  // (ส่วน "ยืมเครื่องมือ" จากกล่องอื่น)
  // ---------------------------------------------------------------------------
  imports: [
    // 1. "ลงทะเบียน" Models (พิมพ์เขียว) ที่จะใช้กับ Database
    // (MongooseModule.forFeature คือการบอกว่า "ในกล่อง Products นี้")
    // (เราจะมีการ "คุย" กับ Database ใน Collection 'products')
    MongooseModule.forFeature([
      // (เพื่อให้ ProductsService สามารถ Inject @InjectModel(Product.name) ได้)
      { name: Product.name, schema: ProductSchema },
    ]),

    // 2. "ยืม" AuthModule
    // (เหตุผล: ProductsController ต้องใช้ @UseGuards(JwtAuthGuard, AdminGuard))
    // (การ Import กล่องนี้มา ทำให้ "ยาม" จากกล่อง Auth ทำงานในกล่อง Products ได้)
    AuthModule,
  ],

  // ---------------------------------------------------------------------------
  // (ส่วน "พนักงานต้อนรับ" หรือ "ประตูหน้าบ้าน")
  // ---------------------------------------------------------------------------
  controllers: [ProductsController], // (บอกว่า ProductsController คือพนักงานต้อนรับ)

  // ---------------------------------------------------------------------------
  // (ส่วน "คนทำงาน" หรือ "ผู้เชี่ยวชาญ" ภายในกล่องนี้)
  // ---------------------------------------------------------------------------
  providers: [ProductsService], // (บอกว่า ProductsService คือคนทำงานหลัก)
})
export class ProductsModule {}
