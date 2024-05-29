import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { MetaModule } from '../meta/meta.module';
import { SieuThiCodeModule } from '../sieuthicode/sieuthicode.module';
import { HsnrModule } from '../hsnr/hsnr.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    UserModule,
    MetaModule,
    SieuThiCodeModule,
    HsnrModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
