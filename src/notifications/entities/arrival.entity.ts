import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { States } from '../enum/States.enum';

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
    enum: States
  })
  state: States;

  @Column({
    type: 'boolean'
  })
  exception: boolean;

  @Column({
    nullable: true,
    type: 'timestamp'
  })
  arrivalTime: Date;
}
