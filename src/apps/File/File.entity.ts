import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum fileStatusEnum {
  UNCREATED = 'UNCREATED',
  PARSED = 'PARSED',
  CEP_VALIDATED = 'CEP_VALIDATED',
  CEP_VALIDATED_WITH_ERRORS = 'CEP_VALIDATED_WITH_ERRORS',
  DOCUMENT_VALIDATED = 'DOCUMENT_VALIDATED',
  DOCUMENT_VALIDATED_WITH_ERRORS = 'DOCUMENT_VALIDATED_WITH_ERRORS',
  FINISHED = 'FINISHED',
}

@Entity()
export class File extends BaseEntity {
  @ObjectIdColumn({
    type: 'uuid',
  })
  _id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  cep!: string;

  @Column()
  document!: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  updatedAt?: Date;

  @Column({
    type: 'enum',
    enum: fileStatusEnum,
    default: fileStatusEnum.UNCREATED,
  })
  fileStatus!: fileStatusEnum;
}
