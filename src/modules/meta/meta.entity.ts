import {
  Entity,
  Column,
  PrimaryColumn,
  ObjectId,
  ObjectIdColumn,
} from 'typeorm';

@Entity()
export class Meta {
  @ObjectIdColumn()
  id: ObjectId;

  @PrimaryColumn()
  meta_key: string;

  @Column({
    nullable: true,
    type: 'simple-json',
  })
  meta_value: any;
}
