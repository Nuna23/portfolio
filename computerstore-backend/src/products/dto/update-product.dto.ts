// server/src/products/dto/update-product.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// คัดลอกกฎจาก CreateProductDto แต่ทำให้ทุกช่อง "ไม่บังคับ"
export class UpdateProductDto extends PartialType(CreateProductDto) {}
