import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomString } from 'src/common/helpers/randomString';
import { In, LessThan, MongoRepository, Not, Repository } from 'typeorm';
import { MetaService } from '../meta/meta.service';
import { UserService } from '../user/user.service';
import {
  OrderStatus,
  OrderType,
  TransferStatus,
  TransferType,
} from './order.constant';
import { CreateOrderDto, HsnrDto } from './order.dto';
import { Order } from './order.entity';
import {
  HistoryMbbank,
  SieuThiCodeService,
} from '../sieuthicode/sieuthicode.service';
import { sleep } from 'src/common/helpers';
import { HsnrService } from '../hsnr/hsnr.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { getMultiplier } from 'src/common/helpers/getMultiplier';
import { TransactionsService } from '../transaction/transaction.service';
import { getSecretKey } from 'src/common/helpers/getSecretKey';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: MongoRepository<Order>,
    private readonly userService: UserService,
    private readonly metaService: MetaService,
    private readonly sieuThiCodeService: SieuThiCodeService,
    private readonly hsnrService: HsnrService,
    // private readonly transactionService: TransactionsService,
    @InjectQueue('order') private readonly orderQueue: Queue,
  ) {}

  async getMany(query: any) {
    const where: any = {};

    if (query.from) {
      where.created_at = { ...where.created_at, $gte: query.from };
    }

    if (query.to) {
      where.created_at = { ...where.created_at, $lte: query.to };
    }

    const data = await this.orderRepository.find({
      where,
      order: { created_at: 'DESC' },
      // take: limit,
      // skip: (page - 1) * limit,
    });

    return { data };
  }

  async createOne(dto: CreateOrderDto) {
    const secret_key = randomString(6);
    const metaData = await this.metaService.get('setting_data');

    let multiplier = 1;

    if (metaData?.meta_value[`multiplier${dto.send_server}`]) {
      multiplier = getMultiplier(
        dto.amount,
        +metaData.meta_value[`multiplier${dto.send_server}`],
      );
    }

    const order = await this.orderRepository.save({
      amount: dto.amount,
      description: dto.description || '',
      order_status: OrderStatus.Pending,
      order_type: dto.order_type || OrderType.SellGold,
      secret_key,
      multiplier,
      send_username: dto.send_username,
      transfer_type: dto.transfer_type || TransferType.MBBANK,
      send_server: dto.send_server,
      is_deleted: false,
    });

    return order;
  }

  async deleteOne(id: number) {
    return await this.orderRepository.delete(id);
  }

  async getBySecretKey(secretKey: string) {
    return await this.orderRepository.findOne({
      where: { secret_key: secretKey },
    });
  }

  async getOne(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) throw new NotFoundException('Order');

    return order;
  }

  async confirmTransfer(id: number) {
    const order = await this.getOne(id);
    if (order.order_status !== OrderStatus.Pending) {
      return TransferStatus.OutOfDate;
    }

    const fifteenMinutesInMilliseconds = 15 * 60 * 1000; // 15 phút = 900000 mili giây
    const fifteenMinutesAfterOrderCreation = new Date(
      order.created_at.getTime() + fifteenMinutesInMilliseconds,
    );

    if (new Date() > fifteenMinutesAfterOrderCreation) {
      order.order_status = OrderStatus.Canceled;
      await this.orderRepository.save(order);
      return TransferStatus.OutOfDate;
    }

    this.actionCheck(order);
    return TransferStatus.Success;
  }

  async actionCheck(order: Order) {
    let numLoop = 20;
    let count = 0;
    while (count < numLoop) {
      count++;
      console.log('check transaction', count);
      const bank = await this.sieuThiCodeService.getHistoryBySecretKeyAndFrom(
        order.secret_key,
        // order.created_at.toISOString(),
      );
      if (bank) {
        return await this.checkTransaction(order, bank);
      }
      await sleep(2000);
    }

    return TransferStatus.NotTransaction;
  }

  async handleWebhooks(histories: HistoryMbbank[]) {
    await this.checkTransactionsWebhooks(histories);
  }

  async checkTransaction(order: Order, bank: HistoryMbbank) {
    if (+order.amount !== +bank.amount) {
      console.log('wrong amount', bank.amount, order.amount);
      order.order_status = OrderStatus.Wrong;
      await this.orderRepository.save(order);
      return TransferStatus.WrongAmount;
    }

    const payload = {
      account: order.send_username,
      server: order.send_server.toString(),
      total: Math.floor((order.amount * order.multiplier) / 1000),
    };

    try {
      await this.orderQueue.add('handlePayment', {
        orderId: order.id,
        payload,
      });
    } catch (error) {
      console.log('add queue error', error);
    }
    return TransferStatus.Success;
  }

  async canceled(orderId: number) {
    const order = await this.getOne(orderId);

    order.order_status = OrderStatus.Canceled;
    await this.orderRepository.save(order);
  }

  async handleErrorSendGold(order: Order) {
    order.order_status = OrderStatus.Pending;
    await this.orderRepository.save(order);

    const payload = {
      account: order.send_username,
      server: order.send_server.toString(),
      total: Math.floor((order.amount * order.multiplier) / 1000),
    };

    try {
      await this.orderQueue.add('handlePayment', {
        orderId: order.id,
        payload,
      });
    } catch (error) {
      console.log('handleErrorSendGold', error);
    }
  }

  async payment(orderId: number, data: HsnrDto) {
    const order = await this.getOne(orderId);
    if (order.order_status !== OrderStatus.Pending) {
      return console.log('order not pending');
    }
    order.order_status = OrderStatus.Sending;
    await this.orderRepository.save(order);
    const result = await this.hsnrService.sendGold(data);
    if (result == TransferStatus.Success) {
      order.order_status = OrderStatus.Completed;
    } else {
      order.order_status = OrderStatus.ErrorSendGold;
    }
    await this.orderRepository.save(order);
  }

  async checkTransactionsWebhooks(histories: HistoryMbbank[]) {
    if (histories && histories.length > 0) {
      histories.forEach((history) => {
        if (history.description.includes('KEY')) {
          const key = getSecretKey(history.description);
          console.log('GD', key);
          if (key) {
            this.payment2(key, history);
          }
        }
      });
    }
  }

  async payment2(key: string, history: HistoryMbbank) {
    const order = await this.getBySecretKey(key);
    if (order && order.order_status === OrderStatus.Pending) {
      await this.checkTransaction(order, history);
    }
  }

  async checkOrders() {
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    const orders = await this.orderRepository.find({
      where: {
        created_at: LessThan(fifteenMinutesAgo),
        order_status: OrderStatus.Pending,
      },
      order: {
        created_at: 'DESC',
      },
    });

    await this.orderRepository.update(
      {
        id: In(orders.map((item) => item.id)),
      },
      {
        order_status: OrderStatus.Canceled,
      },
    );

    return true;
  }
}
