import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderType, TransferType } from './order.constant';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  amount: number;

  @Column({ default: 0, type: 'decimal', precision: 6, scale: 2 })
  multiplier: number;

  @Column({
    type: 'enum',
    enum: [
      'pending',
      'sending',
      'completed',
      'canceled',
      'wrong',
      'error_send_gold',
    ],
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
  send_server: number;

  @Column()
  secret_key: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
