import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ObjectIdColumn,
  ObjectId,
} from 'typeorm';
import { hash } from 'bcryptjs';

@Entity()
@Unique(['email'])
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  email: string;

  @Column()
  fullname: string;

  @Column({ nullable: true, select: false })
  fullname_search: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ type: 'simple-array' })
  roles: string[];

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false, select: false })
  is_deleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) {
      return;
    }
    this.password = await hash(this.password, 10);
  }
}
