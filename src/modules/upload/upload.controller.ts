import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResource } from 'src/app.role';
import { Auth } from 'src/common/decorators';
import { uploadFromBuffer } from 'src/common/helpers/upload';

@ApiTags(AppResource.UPLOAD)
@Controller('api.upload')
export class UploadController {
  constructor(
    @InjectRolesBuilder()
    private readonly rolesBuilder: RolesBuilder,
  ) {}

  @Auth({
    possession: 'any',
    action: 'create',
    resource: AppResource.UPLOAD,
  })
  @Post('/image')
  @ApiOperation({
    summary: 'Upload Image',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    try {
      const result: any = await uploadFromBuffer(file, 'image');
      return { url: result.secure_url };
    } catch (error) {
      console.log(error);
      throw new Error('Failed to upload and process file');
    }
  }

  @Auth({
    possession: 'any',
    action: 'create',
    resource: AppResource.UPLOAD,
  })
  @Post('/video')
  @ApiOperation({
    summary: 'Upload Video',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: any) {
    try {
      const result: any = await uploadFromBuffer(file, 'video');
      return { url: result.secure_url };
    } catch (error) {
      console.log(error);
      throw new Error('Failed to upload and process file');
    }
  }
}
