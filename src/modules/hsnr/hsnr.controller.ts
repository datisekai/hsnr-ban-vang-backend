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
    console.log('called login');
    return this.hsnrService.login();
  }

  @Get('game-history')
  async gameHistory() {
    return this.hsnrService.gameHistory();
  }

  @Post('test-send-gold')
  async test(@Body() data: any) {
    return this.hsnrService.sendGold(data);
  }
}
