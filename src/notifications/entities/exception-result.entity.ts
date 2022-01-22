import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Result } from '../enum/Result.enum';
import { States } from '../enum/States.enum';

@Entity()
export class ExceptionResultEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    nullable: false
  })
  exceptionId: number;

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
