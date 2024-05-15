import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomString } from 'src/common/helpers/randomString';
import { MongoRepository, Repository } from 'typeorm';
import { MetaService } from '../meta/meta.service';
import { UserService } from '../user/user.service';
import { OrderStatus, OrderType, TransferType } from './order.constant';
import { CreateOrderDto } from './order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: MongoRepository<Order>,
    private readonly userService: UserService,
    private readonly metaService: MetaService,
  ) {}

  async getMany(query: any) {
    const page = +query.page || 1;
    const limit = +query.limit || 10;

    const where: any = {};

    if (query.from) {
      where.created_at = { ...where.created_at, $gte: query.from };
    }

    if (query.to) {
      where.created_at = { ...where.created_at, $lte: query.to };
    }

    const [data, totalEntries] = await this.orderRepository.findAndCount({
      where,
      order: { created_at: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, totalEntries, page, limit };
  }

  async createOne(dto: CreateOrderDto) {
    const secret_key = randomString(6);
    const metaData = await this.metaService.get('setting_data');

    let multiplier = 1;

    if (metaData?.meta_value[`multiplier${dto.send_server}`]) {
      multiplier = +metaData.meta_value[`multiplier${dto.send_server}`];
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

  async deleteOne(id: string) {
    return await this.orderRepository.delete(id);
  }

  async getBySecretKey(secretKey: string) {
    return await this.orderRepository.findOne({
      where: { secret_key: secretKey },
    });
  }

  async getOne(id: string) {
    const order = await this.orderRepository.findOneById(id);

    if (!order) throw new NotFoundException('Order');

    return order;
  }
}
