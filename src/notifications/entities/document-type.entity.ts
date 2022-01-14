import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExceptionEntity } from './exception.entity';

@Entity()
export class DocumentTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false
  })
  documentTypeId: number;

  @ManyToOne(() => ExceptionEntity, (exception) => exception.documentTypeIds, {
    nullable: false
  })
  exception: ExceptionEntity;
}
