import { dbConnections, rabbit } from '@config/index';
import { CustomError } from 'express-handler-errors';
import { getConnection, MongoRepository } from 'typeorm';
import { ObjectId } from 'bson';
import { RabbitPublisher } from 'src/services/RabbitPublisher';
import { File, fileItemStatusEnum, fileStatusEnum } from './File.entity';

class FileService {
  private readonly repository: MongoRepository<File>;

  private publisher = RabbitPublisher.getInstance();

  constructor() {
    this.repository = getConnection(
      dbConnections.mongo.name
    ).getMongoRepository(File);
  }

  private async parseFile(
    file: Express.Multer.File,
    _id: ObjectId
  ): Promise<void> {
    try {
      const entireFileInArray = file.buffer.toString().split(/\n/);
      const eachLine = entireFileInArray.map((line) => line.split(';'));

      eachLine.map(async (l) => {
        await this.publisher.publishOnQueue(
          rabbit.validator_document_queue,
          JSON.stringify(l)
        );

        await this.repository.save({
          _id,
          fileStatus: fileStatusEnum.PARSED,
          items: eachLine.map((item: string[]) => ({
            document: {
              value: item[0],
              status: fileItemStatusEnum.NOK,
            },
            name: {
              value: item[1],
              status: fileItemStatusEnum.NOK,
            },
            cep: {
              value: item[2],
              status: fileItemStatusEnum.NOK,
            },
            email: {
              value: item[3],
              status: fileItemStatusEnum.NOK,
            },
            amount: {
              value: Number(item[4]),
              status: fileItemStatusEnum.NOK,
            },
          })),
        });
      });
    } catch (error) {
      throw new CustomError({
        code: 'FILE_GENERIC_ERROR',
        message: 'Erro genérico',
        status: 500,
      });
    }
  }

  async create(file: Express.Multer.File): Promise<void> {
    try {
      const _id = new ObjectId();

      await this.repository.save({
        _id,
        rawFile: file.buffer.toString(),
        fileStatus: fileStatusEnum.UNPARSED,
      });

      const response = this.parseFile(file, _id);
      return response;
    } catch (error) {
      if (error.code === 11000)
        throw new CustomError({
          code: 'FILE_ALREADY_EXISTS',
          message: 'File já existente',
          status: 409,
        });
      throw error;
    }
  }
}

export default new FileService();
