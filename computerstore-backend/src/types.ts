// server/src/types.ts (หรือไฟล์อื่นที่คุณใช้เก็บไทป์)
import { Request } from 'express';

// พิมพ์เขียวของ User ที่ได้จาก JWT
export interface UserPayload {
  role: string;
  _id: string;
  email: string;
  name: string;
}

// พิมพ์เขียวของ Request ที่มี User แปะอยู่
export interface RequestWithUser extends Request {
  user: UserPayload;
}
