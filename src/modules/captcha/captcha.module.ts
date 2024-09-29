import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CaptchaService } from './captcha.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [],
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule {}
