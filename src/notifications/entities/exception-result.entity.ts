import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Result } from '../enum/Result.enum';
import { States } from '../enum/States.enum';
import { ExceptionEntity } from './exception.entity';

@Entity()
export class ExceptionResultEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @OneToOne(() => ExceptionEntity)
  @JoinColumn()
  exception: ExceptionEntity;

  @Column({
    nullable: false
  })
  managerId: number;

  @Column({
    nullable: false
  })
  comment: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Result
  })
  result: Result;

  @Column({
    type: 'enum',
    nullable: false,
    enum: States,
    default: States.PENDING
  })
  state?: States;
}
