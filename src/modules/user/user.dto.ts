import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { AppRoles } from 'src/app.role';
import { EnumToString } from 'src/common/helpers';

export class UserDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  email: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  password: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  fullname: string;

  @IsArray()
  @ApiPropertyOptional()
  @IsEnum(AppRoles, {
    each: true,
    message: `must be a valid role value, ${EnumToString(AppRoles)}`,
  })
  roles: string[];

  @IsBoolean()
  @ApiPropertyOptional()
  is_active: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fcmToken?: string;
}

export class CreateUserDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullname: string;

  @IsArray()
  @ApiPropertyOptional()
  @IsEnum(AppRoles, {
    each: true,
    message: `must be a valid role value, ${EnumToString(AppRoles)}`,
  })
  roles: string[];

  @IsBoolean()
  @ApiPropertyOptional()
  is_active: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fcmToken?: string;
}

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullname: string;

  @IsEmail()
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;
}

export class EditUserDto extends PartialType(CreateUserDto) {}

export class EditFcmTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fcmToken: string;
}
