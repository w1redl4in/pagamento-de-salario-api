import { dbConnections } from '@config/index';
import { CustomError } from 'express-handler-errors';
import { getConnection, MongoRepository } from 'typeorm';
import { ObjectId } from 'bson';
import { File, fileStatusEnum } from './File.entity';

class FileService {
  private readonly repository: MongoRepository<File>;

  constructor() {
    this.repository = getConnection(
      dbConnections.mongo.name
    ).getMongoRepository(File);
  }

  private async parseFile(
    file: Express.Multer.File,
    _id: ObjectId
  ): Promise<File> {
    try {
      const array = file.buffer.toString().split(/\n/);
      const line = array.map((item) => item.split(';'));

      const updatedFile = await this.repository.save({
        _id,
        fileStatus: fileStatusEnum.PARSED,
        items: line.map((i: string[]) => ({
          document: i[0],
          name: i[1],
          cep: i[2],
          email: i[3],
        })),
      });

      return updatedFile;
    } catch (error) {
      throw new CustomError({
        code: 'FILE_GENERIC_ERROR',
        message: 'Erro genérico',
        status: 500,
      });
    }
  }

  async create(file: Express.Multer.File): Promise<File> {
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
