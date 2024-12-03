import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ACGuard, InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResource } from 'src/app.role';
import { Auth } from 'src/common/decorators';
import { uploadFromBuffer } from 'src/common/helpers/upload';
import { HsnrService } from './hsnr.service';
import { AuthGuard } from '@nestjs/passport';

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
    const response = await this.hsnrService.login2();
    return true;
  }

  // @UseGuards(AuthGuard('jwt'), ACGuard)
  @Get('game-history')
  async gameHistory() {
    return this.hsnrService.gameHistory();
  }

  // @Post('test-send-gold')
  // async test(@Body() data: any) {
  //   return this.hsnrService.sendGold(data);
  // }
}
