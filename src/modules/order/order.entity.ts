import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderType, TransferType } from './order.constant';

@Entity()
export class Order {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ default: 0 })
  amount: number;

  @Column({ default: 0 })
  multiplier: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending',
  })
  order_status: string;

  @Column({
    type: 'enum',
    enum: OrderType,
    default: OrderType.SellGold,
  })
  order_type: string;

  @Column({
    type: 'enum',
    enum: TransferType,
    default: TransferType.MBBANK,
  })
  transfer_type: string;

  @Column()
  send_username: string;

  @Column()
  secret_key: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false, select: false })
  is_deleted: boolean;
}
