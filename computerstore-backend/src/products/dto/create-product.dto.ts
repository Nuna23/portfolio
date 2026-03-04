// server/src/products/dto/create-product.dto.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "พิมพ์เขียว" (DTO) สำหรับ "สร้างสินค้าใหม่"
 *
 * มันกำหนด "กฎ" ทั้งหมดที่ข้อมูล (JSON) ที่ส่งมาจาก Frontend (เช่น ฟอร์ม Add Product)
 * ต้องปฏิบัติตาม
 *
 * มันมี "พิมพ์เขียวย่อย" (SpecsDto) ซ้อนอยู่ข้างใน
 * -----------------------------------------------------------------------------
 */

// 1. Import "เครื่องมือ"
// (Import 'Type' สำหรับ DTO ที่ซ้อนกัน)
import { Type } from 'class-transformer';
// (Import "กฎ" ต่างๆ จาก class-validator)
import {
  IsString,
  IsNumber,
  IsInt,
  Min,
  IsArray,
  IsUrl,
  IsObject,
  ValidateNested, // (เครื่องมือสำหรับ "ตรวจ" DTO ที่ซ้อนกัน)
  IsNotEmpty,
} from 'class-validator';

// ---------------------------------------------------------------------------
// 2. พิมพ์เขียวย่อย: "สเปคคอมพิวเตอร์" (SpecsDto)
// ---------------------------------------------------------------------------
// (เราสร้าง Class นี้เพื่อจัดกลุ่มสเปค)
export class SpecsDto {
  @IsString()
  @IsNotEmpty() // (ห้ามว่าง)
  cpu: string;

  @IsString()
  @IsNotEmpty()
  ram: string;

  @IsString()
  @IsNotEmpty()
  storage: string;

  // (gpu กับ display ไม่จำเป็นต้องมี @IsNotEmpty)
  // (แปลว่า "อนุญาต" ให้ส่งค่าว่างมาได้ (Optional))
  @IsString()
  gpu: string;
  @IsString()
  display: string;
}

// ---------------------------------------------------------------------------
// 3. พิมพ์เขียวหลัก: "สินค้า" (CreateProductDto)
// (นี่คือ DTO หลักที่เราจะ `export` ไปให้ Controller ใช้)
// ---------------------------------------------------------------------------
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber() // (ต้องเป็นตัวเลข (ทศนิยมได้))
  @Min(0) // (ห้ามราคาติดลบ)
  price: number;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  category: string; // 3.1 🚨 (สำคัญ) กฎสำหรับ 'specs' (Object ที่ซ้อนอยู่) 🚨

  @IsObject() // (ต้องเป็น Object)
  @ValidateNested() // (สั่งให้ "เจาะ" เข้าไปตรวจข้างใน)
  @Type(() => SpecsDto) // (บอกว่า "กฎ" ที่ใช้ตรวจข้างใน คือ `SpecsDto`)
  specs: SpecsDto; // (property `specs` ต้องมีหน้าตาเหมือน `SpecsDto`)
  // 3.2 กฎสำหรับ 'stock' (จำนวนคงคลัง)

  @IsInt() // (ต้องเป็น "เลขจำนวนเต็ม" เท่านั้น (เช่น 1, 2, 3 ห้ามเป็น 1.5))
  @Min(0) // (สต็อกห้ามติดลบ)
  stock: number; // 3.3 กฎสำหรับ 'imageUrls' (รูปภาพ)

  @IsArray() // (ต้องเป็น Array)
  // (สั่งให้ "ตรวจ" Array นี้ "ทุกตัว" (`each: true`))
  // (ว่า "ทุกตัว" ใน Array ต้องเป็น "รูปแบบ URL ที่ถูกต้อง")
  @IsUrl({}, { each: true })
  imageUrls: string[]; // (เช่น ["http://...", "https://..."])
}

/*
 * -----------------------------------------------------------------------------
 * (สรุปการทำงาน)
 * เมื่อ Admin (Frontend) กรอกฟอร์ม "Add New Product" แล้วกด Submit
 * 1. Frontend ส่ง JSON ก้อนใหญ่มาที่ `POST /products`
 * 2. `ProductsController` (พนักงานต้อนรับ) รับเรื่อง
 * 3. `ValidationPipe` (ยาม) ทำงาน
 * 4. "ยาม" จะเอากฎใน `CreateProductDto` นี้ไป "ตรวจสอบ" JSON ก้อนนั้น
 * 5. มันจะตรวจ `name`, `price`, `stock` ฯลฯ
 * 6. มันจะ "เจาะ" เข้าไปตรวจ `specs` โดยใช้กฎของ `SpecsDto`
 * 7. มันจะ "วนลูป" ตรวจ `imageUrls` ทุกตัว ว่าเป็น URL จริงหรือไม่
 * 8. (ถ้าผ่าน) ถึงจะส่งข้อมูล (Dto) นี้ต่อให้ `ProductsService` (ห้องครัว) สร้างสินค้า
 * -----------------------------------------------------------------------------
 */
