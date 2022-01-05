import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { States } from '../enum/States.enum';

@Entity()
export class ExceptionEntitiy {
  @PrimaryGeneratedColumn()
  id: number;

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
    type: 'enum',
    nullable: false,
    enum: States,
    default: States.PENDING
  })
  state: States;

  @Column({
    nullable: false
  })
  documentTypeIds: number[];
}
