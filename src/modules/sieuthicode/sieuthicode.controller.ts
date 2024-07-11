import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ACGuard, InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResource } from 'src/app.role';
import { SieuThiCodeService } from './sieuthicode.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags(AppResource.SIEUTHICODE)
@Controller('api.sieuthicode')
export class SieuThiCodeController {
  constructor(
    @InjectRolesBuilder()
    private readonly rolesBuilder: RolesBuilder,
    private readonly sieuthicodeService: SieuThiCodeService,
  ) {}

  @UseGuards(AuthGuard('jwt'), ACGuard)
  @Get('mb-history')
  async mbHistory() {
    const histories = await this.sieuthicodeService.getHistoryMbbank();
    return { data: histories };
  }

  // @Post('test-send-gold')
  // async test(@Body() data: any) {
  //   return this.hsnrService.sendGold(data);
  // }
}
