import { File } from '@apps/File/File.entity';
import { createConnections } from 'typeorm';

import { dbConnections, server } from '../index';

const connection = createConnections([
  {
    name: dbConnections.mongo.name,
    type: 'mongodb',
    url: dbConnections.mongo.conn,
    entities: [File],
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: server.env === 'dev',
  },
]);

export default connection;
