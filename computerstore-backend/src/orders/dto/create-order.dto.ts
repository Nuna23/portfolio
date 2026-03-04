// server/src/orders/dto/create-order.dto.ts
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// พิมพ์เขียว "สินค้า 1 ชิ้นในออเดอร์"
class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string; // เราเก็บแค่ ID ก็พอ

  @IsString()
  @IsNotEmpty()
  name: string; // เก็บ name/price ตอนที่สั่ง เผื่อสินค้าเปลี่ยนราคา

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

// พิมพ์เขียว "ที่อยู่จัดส่ง"
class ShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;
}

// พิมพ์เขียว "ออเดอร์"
export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;
}
