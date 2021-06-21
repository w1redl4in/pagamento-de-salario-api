import { createConnections } from 'typeorm';

import { dbConnections, server } from '../index';

const connection = createConnections([
  {
    name: dbConnections.mongo.name,
    type: 'mongodb',
    url: dbConnections.mongo.conn,
    entities: [],
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: server.env === 'dev',
  },
]);

export default connection;
