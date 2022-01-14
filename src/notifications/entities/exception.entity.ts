import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { States } from '../enum/States.enum';
import { DocumentTypeEntity } from './document-type.entity';

@Entity()
export class ExceptionEntity {
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
    type: 'enum',
    nullable: false,
    enum: States,
    default: States.PENDING
  })
  state?: States;

  @OneToMany(
    () => DocumentTypeEntity,
    (documentType) => documentType.exception,
    { nullable: false }
  )
  documentTypeIds: DocumentTypeEntity[];
}
