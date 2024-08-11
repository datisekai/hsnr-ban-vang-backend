import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RecaptchaService } from './recaptcha.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [],
  providers: [RecaptchaService],
  exports: [RecaptchaService],
})
export class RecaptchaModule {}
