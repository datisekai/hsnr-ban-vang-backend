import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getSecretKey } from 'src/common/helpers/getSecretKey';
import { OrderService } from 'src/modules/order/order.service';
import {
  HistoryMbbank,
  SieuThiCodeService,
} from 'src/modules/sieuthicode/sieuthicode.service';
import { OrderStatus } from '../order/order.constant';
import { MoreThanOrEqual } from 'typeorm';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly sieuthicodeService: SieuThiCodeService,
  ) {}

  // Định nghĩa cron job chạy mỗi 2 phút
  @Cron('0 */5 * * * *')
  handleCron() {
    this.logger.debug('Running the cron job to check transactions');
    // Logic kiểm tra giao dịch tại đây
    this.checkTransactions();
  }

  async checkOrders() {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60000);
    const { data } = await this.orderService.getMany({
      order_status: OrderStatus.ErrorSendGold,
      created_at: MoreThanOrEqual(fifteenMinutesAgo),
    });

    const fifteenMinutesInMilliseconds = 15 * 60 * 1000; // 15 phút = 900000 mili giây

    if (data && data?.length > 0) {
      for (const order of data) {
        const fifteenMinutesAfterOrderCreation = new Date(
          order.created_at.getTime() + fifteenMinutesInMilliseconds,
        );
        if (new Date() <= fifteenMinutesAfterOrderCreation) {
          await this.orderService.handleErrorSendGold(order);
        } else {
          await this.orderService.canceled(order.id);
        }
      }
    }
  }

  // Hàm giả lập kiểm tra giao dịch
  async checkTransactions() {
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const histories = await this.sieuthicodeService.getHistoryMbbank(
      'IN',
      twoMinutesAgo.toISOString(),
    );
    if (histories && histories.length > 0) {
      histories.forEach((history) => {
        if (history.description.includes('KEY')) {
          const key = getSecretKey(history.description);
          console.log('GD', key);
          if (key) {
            this.payment(key, history);
          }
        }
      });
    }
  }

  async checkTransactionsWebhooks(histories: HistoryMbbank[]) {
    if (histories && histories.length > 0) {
      histories.forEach((history) => {
        if (history.description.includes('KEY')) {
          const key = getSecretKey(history.description);
          console.log('GD', key);
          if (key) {
            this.payment(key, history);
          }
        }
      });
    }
  }

  async payment(key: string, history: HistoryMbbank) {
    const order = await this.orderService.getBySecretKey(key);
    console.log('payment', key, order);
    if (order && order.order_status === OrderStatus.Pending) {
      await this.orderService.checkTransaction(order, history);
    }
  }
}
