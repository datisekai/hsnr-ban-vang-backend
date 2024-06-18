import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HsnrService } from './hsnr.service';
import { Captcha69Module } from '../captcha69/captcha69.module';
import { HsnrController } from './hsnr.controller';
import { MetaModule } from '../meta/meta.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    Captcha69Module,
    MetaModule,
  ],
  controllers: [HsnrController],
  providers: [HsnrService],
  exports: [HsnrService],
})
export class HsnrModule {}
