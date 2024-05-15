import {
  IsString,
  IsNumber,
  IsDefined,
  IsIn,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MetaDto {
  @IsString()
  meta_key?: string;

  meta_value?: any | any[];
}

export class CreateMetaDto extends MetaDto {
  @IsDefined()
  meta_key: string;

  @IsDefined()
  meta_value: any;
}
export class UpdateMetaDto extends MetaDto {
  @IsOptional()
  meta_key?: string;
}

export class UpdateManyMetaDto {
  @ApiProperty()
  @IsArray()
  data: CreateMetaDto[];
}
