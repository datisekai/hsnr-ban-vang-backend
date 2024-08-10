import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderModule } from '../order/order.module';
import { TransactionsService } from './transaction.service';
import { SieuThiCodeModule } from '../sieuthicode/sieuthicode.module';

@Module({
  imports: [SieuThiCodeModule, forwardRef(() => OrderModule)],
  controllers: [],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionModule {}
