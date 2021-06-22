import { dbConnections } from '@config/index';
import { CustomError } from 'express-handler-errors';
import { getConnection, MongoRepository } from 'typeorm';
import { File } from './File.entity';

class FileService {
  private readonly repository: MongoRepository<File>;

  constructor() {
    this.repository = getConnection(
      dbConnections.mongo.name
    ).getMongoRepository(File);
  }

  async create(file: File): Promise<File> {
    try {
      const response = await this.repository.save(file);
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
