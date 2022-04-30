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
export class ArrivalEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    nullable: false
  })
  driverId: number;

  @Column({
    nullable: false
  })
  vehicleId: number;

  @Column({
    nullable: false
  })
  securityId: number;

  @Column({
    nullable: true
  })
  expeditorId?: number;

  @Column({
    nullable: true
  })
  driver?: string;

  @Column({
    nullable: true
  })
  vehicle?: string;

  @Column({
    nullable: true
  })
  contractor?: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: States,
    default: States.PENDING
  })
  state?: States;

  @Column({
    type: 'enum',
    nullable: true,
    enum: Result
  })
  result?: Result;

  @OneToOne(() => ExceptionEntity, (exception) => exception.arrival)
  exception?: ExceptionEntity;

  @Column({
    nullable: false,
    type: 'timestamp'
  })
  arrivalTime: Date;

  @Column({
    nullable: true
  })
  palletsEntrada?: number;

  @Column({
    nullable: true
  })
  palletsSalida?: number;

  @Column({
    nullable: true
  })
  destiny?: string;
}
