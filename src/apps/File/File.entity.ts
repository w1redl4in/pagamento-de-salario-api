import { ObjectID } from 'bson';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum fileStatusEnum {
  UNPARSED = 'UNPARSED',
  PARSED = 'PARSED',
  CEP_VALIDATED = 'CEP_VALIDATED',
  CEP_VALIDATED_WITH_ERRORS = 'CEP_VALIDATED_WITH_ERRORS',
  DOCUMENT_VALIDATED = 'DOCUMENT_VALIDATED',
  DOCUMENT_VALIDATED_WITH_ERRORS = 'DOCUMENT_VALIDATED_WITH_ERRORS',
  FINISHED = 'FINISHED',
}

export type FileItem = {
  document: string;
  name: string;
  cep: string;
  email: string;
};

@Entity()
export class File extends BaseEntity {
  @ObjectIdColumn({
    type: 'uuid',
  })
  _id!: ObjectID;

  @Column()
  rawFile!: string;

  @Column()
  items?: FileItem[];

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
    default: fileStatusEnum.UNPARSED,
  })
  fileStatus!: fileStatusEnum;
}
