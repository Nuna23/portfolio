// server/src/main.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "จุดเริ่มต้น" (Entry Point) ของ Server ทั้งหมด
 *
 * เมื่อคุณรัน `npm run start:dev` (Backend)
 * ไฟล์นี้คือ "ไฟล์แรก" ที่ถูกเรียกใช้งาน (Execute)
 *
 * หน้าที่ของมันคือ:
 * 1. "สร้าง" (Create) แอปพลิเคชัน Nest.js ขึ้นมาจาก "กล่องหลัก" (AppModule)
 * 2. "ตั้งค่า" (Configuration) ที่สำคัญๆ ที่ต้องใช้ "ทั่วทั้งแอป" (Global)
 * 3. "เปิด" (Listen) Port เพื่อรอรับ Request จาก Client (Frontend)
 * -----------------------------------------------------------------------------
 */

import { NestFactory } from '@nestjs/core'; // (Import "โรงงาน" สำหรับสร้างแอป)
import { AppModule } from './app.module'; // (Import "กล่องหลัก" ที่ประกอบทุกอย่างไว้)
import { ValidationPipe } from '@nestjs/common'; // (Import "ยาม" ตรวจสอบข้อมูล)

// (สร้างฟังก์ชัน `bootstrap` (แปลว่า "เริ่มต้น") เพื่อรัน Server)
async function bootstrap() {
  // 1. "สร้าง" แอปพลิเคชัน
  // (NestFactory.create จะอ่าน "กล่องหลัก" (AppModule)
  // เพื่อดูว่ามี "กล่องย่อย" (Modules), "พนักงานต้อนรับ" (Controllers)
  // และ "คนทำงาน" (Services) อะไรบ้าง)
  const app = await NestFactory.create(AppModule); // 2. 🚨 (สำคัญ) "เปิดใช้งาน CORS" 🚨
  // (CORS = Cross-Origin Resource Sharing)

  // (โดยปกติ เบราว์เซอร์จะ "บล็อก" ไม่ให้ Frontend (ที่รันบน port 5173))
  // (ส่งคำขอ (Request) ข้ามไปหา Backend (ที่รันบน port 3000))
  // `app.enableCors()` คือการบอก Server ว่า:
  // "จงอนุญาตคำขอจาก 'Origin' (Domain/Port) อื่นด้วย (เช่น 5173)")
  app.enableCors(); // 3. 🚨 (สำคัญ) "ติดตั้งยามระดับ Global" 🚨
  // (บอก Nest.js ว่า "จงใช้ ValidationPipe (ยามตรวจสอบข้อมูล) นี้")

  // ("กับ 'ทุก' Route ที่มี @Body() ใน Controller 'ทั่วทั้ง' แอปพลิเคชัน")
  app.useGlobalPipes(
    new ValidationPipe({
      // 3.1 `whitelist: true` (บัญชีขาว)
      // (ถ้า Client ส่ง "ข้อมูลขยะ" ที่ "ไม่" ได้กำหนดไว้ใน DTO มา)
      // (เช่น Client พยายามส่ง `role: 'admin'` มาตอนสมัครสมาชิก)
      // ("จง "กรอง" (strip) field ขยะนั้นทิ้งไปเลย" -> เพื่อความปลอดภัย)
      whitelist: true,

      // 3.2 `transform: true` (แปลงร่าง)
      // (พยายาม "แปลง" ข้อมูลที่ส่งมา ให้ "ตรง" กับ Type ใน DTO)
      // (เช่น Client ส่ง `id` (จาก URL param) มาเป็น `string` "123")
      // (ถ้า DTO คาดหวัง `number` -> มันจะ "แปลง" "123" ให้เป็น `number` 123)
      transform: true,
    }),
  ); // 4. "เปิด Port"

  // (สั่งให้ Server "เริ่มทำงาน" และ "รอฟัง" Request ที่ Port 3000)
  await app.listen(3000);
}

// 5. "รัน" ฟังก์ชันเริ่มต้น
// (void คือการบอก TypeScript ว่า เรารู้ว่า `bootstrap()` เป็น Promise
// แต่เรา "ไม่" ต้องการรอ (await) มันในตอนนี้ (fire-and-forget))
void bootstrap();
