import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HsnrModule } from '../hsnr/hsnr.module';
import { MetaModule } from '../meta/meta.module';
import { SieuThiCodeModule } from '../sieuthicode/sieuthicode.module';
import { UserModule } from '../user/user.module';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderConsumer } from './order.consumer';
import { BullModule } from '@nestjs/bull';
import { TransactionModule } from '../transaction/transaction.module';
import { CaptchaModule } from '../captcha/captcha.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    BullModule.registerQueue({
      name: 'order',
    }),
    UserModule,
    MetaModule,
    SieuThiCodeModule,
    HsnrModule,
    CaptchaModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderConsumer],
  exports: [OrderService],
})
export class OrderModule {}
