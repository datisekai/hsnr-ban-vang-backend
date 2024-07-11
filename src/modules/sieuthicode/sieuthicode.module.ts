import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SieuThiCodeService } from './sieuthicode.service';
import { SieuThiCodeController } from './sieuthicode.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [SieuThiCodeController],
  providers: [SieuThiCodeService],
  exports: [SieuThiCodeService],
})
export class SieuThiCodeModule {}
