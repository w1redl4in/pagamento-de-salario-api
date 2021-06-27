import amqp from 'amqplib';

import { rabbit } from '@config/index';

import logger from '@middlewares/logger';

export class RabbitClient {
  public connection!: amqp.Connection;

  public channel!: amqp.Channel;

  private static instance: RabbitClient;

  constructor() {
    this.createConnection();
  }

  private createConnection(): void {
    logger.info(
      `RabbitClient::createConnection::connecting to ${rabbit.protocol}://${rabbit.host}:${rabbit.port}`
    );
    amqp
      .connect({
        protocol: rabbit.protocol,
        hostname: rabbit.host,
        port: rabbit.port,
        username: rabbit.user,
        password: rabbit.password,
      })
      .then((conn) => {
        logger.info(`RabbitClient::createConnection::creating channel`);
        this.connection = conn;
        this.connectChannel();
        this.connection.on('error', (e) => {
          logger.error(
            `RabbitClient::createConnection::onError - ${e.message}`
          );
        });
        this.connection.on('close', () => {
          logger.warn(`RabbitClient::createConnection::connection close`);
          this.channel.close();
          this.connection.close();
          logger.info(`RabbitClient::createConnection::reconnection rabbitmq`);
          this.createConnection();
        });
      });
  }

  private connectChannel(): void {
    logger.info(`RabbitClient::connectChannel::configuring channel`);
    this.connection.createChannel().then((ch) => {
      this.channel = ch;
      logger.info(`RabbitClient::connectChannel::configured`);

      this.channel.on('close', () => {
        logger.warn(`RabbitClient::connectChannel::channel close`);
        logger.info(`RabbitClient::connectChannel::reconnection channel`);
        this.connectChannel();
      });
    });
  }

  static getInstance(): RabbitClient {
    if (!this.instance) this.instance = new RabbitClient();
    return this.instance;
  }
}
