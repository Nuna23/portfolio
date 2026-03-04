// server/src/auth/auth.service.ts

/*
 * -----------------------------------------------------------------------------
 * (คำอธิบายไฟล์)
 * ไฟล์นี้คือ "Service" (บริการ) หรือ "สมอง" ของระบบ Auth
 *
 * ถ้า Controller (พนักงานต้อนรับ) รับ "ใบสั่ง" (Request) มา
 * Service (ห้องครัว) คือ "ผู้เชี่ยวชาญ" ที่ "ลงมือทำ" งานจริงๆ
 *
 * หน้าที่ของมันคือ:
 * 1. "ลงทะเบียน" (Register): ตรวจสอบอีเมลซ้ำ, สร้าง user, และสร้าง Token
 * 2. "ล็อกอิน" (Login): ค้นหา user, เปรียบเทียบรหัสผ่าน, และสร้าง Token
 * 3. "สร้าง Token" (Sign Token): สร้าง JWT Token ที่มีข้อมูล user (Payload) อยู่ข้างใน
 * -----------------------------------------------------------------------------
 */

import {
  Injectable,
  UnauthorizedException, // (Error 401 - ไม่มีสิทธิ์)
  ConflictException, // (Error 409 - ข้อมูลชนกัน/ซ้ำซ้อน)
} from '@nestjs/common';
import { UsersService } from '../users/users.service'; // (ยืม "เครื่องมือ" จัดการ User)
import { JwtService } from '@nestjs/jwt'; // (ยืม "เครื่องมือ" สร้าง/เซ็น Token)
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'; // (Import "เครื่องมือ" เปรียบเทียบรหัสผ่าน)
import { User } from '../users/schemas/user.schema'; // (Import "พิมพ์เขียว" User)

@Injectable()
export class AuthService {
  // 1. "ฉีด" (Inject) เครื่องมือที่ต้องใช้เข้ามา
  constructor(
    // (เครื่องมือสำหรับคุยกับ Database (users collection))
    private usersService: UsersService,
    // (เครื่องมือสำหรับ "สร้าง" Token (ที่เราตั้งค่า Secret Key ไว้ใน module))
    private jwtService: JwtService,
  ) {}

  // 2. "ฟังก์ชันลงทะเบียน" (ถูกเรียกโดย AuthController)
  async register(createUserDto: CreateUserDto) {
    // 2.1 ค้นหาใน DB ก่อนว่ามีอีเมลนี้หรือยัง
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    // 2.2 ถ้ามี (อีเมลซ้ำ) -> โยน Error 409 (Conflict)
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    // 2.3 (ถ้าไม่ซ้ำ) สั่งให้ UsersService "สร้าง" user
    // (UsersService จะ "Hash" (เข้ารหัส) รหัสผ่านให้เราโดยอัตโนมัติ)
    const user = await this.usersService.create(createUserDto);

    // 2.4 เมื่อสร้างเสร็จ -> "ล็อกอิน" ให้เลยทันที โดยการ "สร้าง Token"
    return this.signToken(user);
  }

  // 3. "ฟังก์ชันล็อกอิน" (ถูกเรียกโดย AuthController)
  async login(loginDto: LoginDto) {
    // 3.1 ค้นหา user ด้วยอีเมลที่กรอกมา
    const user = await this.usersService.findByEmail(loginDto.email);

    // 3.2 ถ้า "ไม่" พบ user (อีเมลผิด) -> โยน Error 401 (Unauthorized)
    // (ข้อควรระวัง: เรา "ไม่" บอก Client ว่า "อีเมลผิด" แต่บอกว่า "ข้อมูลผิด"
    // เพื่อความปลอดภัย, Client จะไม่รู้ว่าอีเมลนี้มีในระบบหรือไม่)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3.3 (ถ้าเจอ user) เปรียบเทียบรหัสผ่าน
    // (bcrypt.compare จะเปรียบเทียบ "รหัสที่กรอกมา" (loginDto.password))
    // (กับ "รหัสที่เข้ารหัสไว้" ใน DB (user.password))
    const isMatch = await bcrypt.compare(loginDto.password, user.password);

    // 3.4 ถ้า "รหัสไม่ตรงกัน" -> โยน Error 401 (Unauthorized)
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3.5 (ถ้าทุกอย่างถูกต้อง) -> "สร้าง Token"
    return this.signToken(user);
  }

  // 4. "ฟังก์ชันช่วย" (Helper) สำหรับ "สร้าง Token"
  private async signToken(user: User) {
    // 4.1 "เตรียมข้อมูล" (Payload) ที่จะ "ยัดไส้" เข้าไปใน Token
    const payload = {
      sub: user._id, // (Subject: ID ของ user)
      email: user.email,
      name: user.name,
      role: user.role, // 🚨 (สำคัญมาก) "ยัด" role เข้าไปใน Token
    };
    // (Payload นี้จะถูก "อ่าน" โดย JwtStrategy (นักถอดรหัส) ในอนาคต)

    // 4.2 สั่งให้ JwtService "เซ็น" (sign) Payload นี้
    // (มันจะใช้ Secret Key ที่เราตั้งค่าไว้ใน .env มาเซ็น)
    // ผลลัพธ์ที่ได้คือ "accessToken" (Token string ยาวๆ)
    const accessToken = await this.jwtService.signAsync(payload);

    // 4.3 "ส่งคืน" ข้อมูลกลับไปให้ Controller
    // (เราส่งทั้ง Token และ ข้อมูล user (ที่ไม่มีรหัสผ่าน) กลับไป)
    // (เพื่อให้ Frontend รู้ว่าล็อกอินสำเร็จ และรู้ว่า "ใคร" ล็อกอินเข้ามา)
    return {
      accessToken, // (Token)
      user: {
        // (ข้อมูล User ที่จะเก็บใน Redux/Context)
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role, // 🚨 (ส่ง Role กลับไปด้วย)
      },
    };
  }
}
