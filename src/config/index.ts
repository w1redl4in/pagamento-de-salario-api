import { config } from 'dotenv';

const envfile = `.env.${process.env.NODE_ENV}`;
const envdir = process.cwd();

config({ path: `${envdir}/${envfile}` });

export const server = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
};

export const rabbit = {
  host: String(process.env.RABBIT_HOST),
  protocol: String(process.env.RABBIT_PROTOCOL),
  port: Number(process.env.RABBIT_PORT),
  user: String(process.env.RABBIT_USER),
  password: String(process.env.RABBIT_PASSWORD),
  validator_document_queue: String(process.env.RABBIT_VALIDATOR_DOCUMENT_QUEUE),
};

export const dbConnections = {
  mongo: {
    name: 'mongo',
    conn: String(process.env.DATABASE_MONGO_CONN),
  },
};
