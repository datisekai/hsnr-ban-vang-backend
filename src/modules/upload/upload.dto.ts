import { IsNotEmpty, Max } from 'class-validator';
import { Multer } from 'multer';

export class UploadDto {
  @IsNotEmpty({ message: 'File is required' })
  file: Multer;
}
