// server/src/orders/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

// Schema ย่อย (ไม่ต้องสร้างไฟล์แยก)
@Schema({ _id: false })
class OrderItem {
  @Prop({ required: true })
  productId: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  price: number;
  @Prop({ required: true })
  quantity: number;
}
const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
class ShippingAddress {
  @Prop({ required: true })
  fullName: string;
  @Prop({ required: true })
  address: string;
  @Prop({ required: true })
  city: string;
  @Prop({ required: true })
  postalCode: string;
}
const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);

// Schema หลัก
@Schema({ timestamps: true })
export class Order extends Document {
  // 1. เจ้าของออเดอร์ (เชื่อมโยงกับ "users" collection)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User; // (เราจะเก็บ _id ของ User)

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ type: ShippingAddressSchema, required: true })
  shippingAddress: ShippingAddress;

  @Prop({ required: true })
  totalPrice: number; // (สำคัญ!) ราคารวมจะถูกคำนวณที่ Backend

  @Prop({ default: 'Pending' }) // สถานะ
  status: string; // เช่น Pending, Processing, Shipped, Delivered
}
export const OrderSchema = SchemaFactory.createForClass(Order);
