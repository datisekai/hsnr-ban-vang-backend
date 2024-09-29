import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';
import { OrderType, TransferType } from './order.constant';

export class OrderDto {
  @ApiPropertyOptional()
  @IsEnum(OrderType, { message: 'Invalid order type' })
  @IsOptional()
  order_type?: OrderType = OrderType.SellGold;

  @ApiPropertyOptional()
  @IsEnum(TransferType, { message: 'Invalid transfer type' })
  @IsOptional()
  transfer_type?: TransferType = TransferType.MBBANK;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recaptcha: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  send_username: string;

  @ApiProperty()
  @IsNumber()
  send_server: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Max(1000001)
  amount: number;
}

export class CreateOrderDto extends OrderDto {}

export class HsnrDto {
  account: string;
  server: string;
  total: number;
}
