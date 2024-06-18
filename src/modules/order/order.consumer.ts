import { Job } from 'bull';
import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderStatus } from './order.constant';

@Processor('order')
export class OrderConsumer {
  private readonly logger = new Logger(OrderConsumer.name);
  constructor(private readonly orderService: OrderService) {}
  @Process('handlePayment')
  async handlePayment(job: Job) {
    const { payload, orderId } = job.data;
    console.log(orderId, payload);
    await this.orderService.payment(orderId, payload);
  }

  @OnQueueError()
  onError(err: Error) {
    console.error(err); // <<<<<<
  }
}
