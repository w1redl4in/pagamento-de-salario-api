import request from 'supertest';
import { MockProxy } from 'jest-mock-extended';
import { MongoRepository } from 'typeorm';

jest.mock('typeorm');
jest.mock('../../src/middlewares/logger');
jest.mock('../../src/services/RabbitPublisher');

describe('## File Module ##', () => {
  const { app } = require('../../src/app').default;

  const repository = require('typeorm').mongoRepositoryMock as MockProxy<
    MongoRepository<any>
  >;
  describe('## POST ##', () => {
    test('should return a error', async () => {
      repository.save.mockResolvedValue(null);

      await request(app).post('/validator/file').expect(404, {});
    });
  });
});
