import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Result } from '../enum/Result.enum';
import { States } from '../enum/States.enum';
import { ArrivalEntity } from './arrival.entity';

@Entity()
export class ExceptionEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'enum',
    nullable: false,
    enum: States,
    default: States.PENDING
  })
  state?: States;

  @Column({
    nullable: true
  })
  managerId?: number;

  @Column({
    nullable: true
  })
  comment?: string;

  @Column({
    type: 'enum',
    nullable: true,
    enum: Result
  })
  result?: Result;

  @OneToOne(() => ArrivalEntity, (arrival) => arrival.exception)
  @JoinColumn()
  arrival?: ArrivalEntity;
}
