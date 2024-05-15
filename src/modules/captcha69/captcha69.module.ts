import { Module } from '@nestjs/common';
import { Captcha69Service } from './captcha69.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [],
  providers: [Captcha69Service],
  exports: [Captcha69Service],
})
export class Captcha69Module {}
