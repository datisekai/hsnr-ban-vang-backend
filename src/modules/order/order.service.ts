import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomString } from 'src/common/helpers/randomString';
import { ObjectId, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { OrderStatus, OrderType, TransferType } from './order.constant';
import { CreateOrderDto } from './order.dto';
import { Order } from './order.entity';
import { MetaService } from '../meta/meta.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly userService: UserService,
    private readonly metaService: MetaService,
  ) {}

  async getMany(query: any) {
    const page = +query.page || 1;
    const limit = +query.limit || 10;

    const where: any = { is_deleted: false };

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
    const metaData = await this.metaService.get('landing_data');

    let multiplier = 1;
    if (metaData?.meta_value['multiplier']) {
      multiplier = +metaData.meta_value['multiplier'];
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
    });

    return order;
  }

  async deleteOne(id: ObjectId) {
    const removedOrder = await this.orderRepository.findOne({
      where: { id, is_deleted: false },
    });
    removedOrder.is_deleted = true;
    return await this.orderRepository.save(removedOrder);
  }

  async getBySecretKey(secretKey: string) {
    return await this.orderRepository.findOne({
      where: { secret_key: secretKey, is_deleted: false },
    });
  }
}
