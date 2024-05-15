import {
  Body,
  Controller,
  Get,
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
import { HsnrService } from './hsnr.service';

@ApiTags(AppResource.HSNR)
@Controller('api.hsnr')
export class HsnrController {
  constructor(
    @InjectRolesBuilder()
    private readonly rolesBuilder: RolesBuilder,
    private readonly hsnrService: HsnrService,
  ) {}

  @Get('login')
  async login() {
    return this.hsnrService.login();
  }
}
