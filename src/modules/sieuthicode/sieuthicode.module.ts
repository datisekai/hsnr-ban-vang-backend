import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SieuThiCodeService } from './sieuthicode.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [],
  providers: [SieuThiCodeService],
  exports: [SieuThiCodeService],
})
export class SieuThiCodeModule {}
