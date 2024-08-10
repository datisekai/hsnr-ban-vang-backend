import {
  Entity,
  Column,
  PrimaryColumn,
  ObjectId,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Meta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  meta_key: string;

  @Column({
    nullable: true,
    type: 'simple-json',
  })
  meta_value: any;
}
