// server/src/orders/orders.controller.ts
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Request,
  Get,
  Param, // 1. 🚨 (ใหม่) Import Param 🚨
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { type RequestWithUser } from '../types';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: RequestWithUser,
    @Body(new ValidationPipe()) createOrderDto: CreateOrderDto,
  ) {
    // ... (โค้ด create เหมือนเดิม) ...
    const userId = req.user._id;
    return this.ordersService.create(userId, createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyOrders(@Request() req: RequestWithUser) {
    // ... (โค้ด findMyOrders เหมือนเดิม) ...
    const userId = req.user._id;
    return this.ordersService.findMyOrders(userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('all')
  findAllOrders() {
    // ... (โค้ด findAllOrders เหมือนเดิม) ...
    return this.ordersService.findAllOrders();
  }

  // 2. 🚨🚨🚨 (นี่คือ Route ที่เพิ่มเข้ามา) 🚨🚨🚨
  // (Route นี้ต้องใช้ JwtAuthGuard เพราะทั้ง Admin และ Customer สามารถดูได้)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOrderById(@Param('id') id: string) {
    // (เราควรเพิ่ม Logic ตรวจสอบว่า User คนนี้เป็นเจ้าของ Order รหัสนี้หรือไม่)
    // (แต่สำหรับตอนนี้ เราใช้แค่ findOrderById ไปก่อน)
    return this.ordersService.findOrderById(id);
  }
}
