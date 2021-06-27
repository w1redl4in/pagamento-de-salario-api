import { Options } from 'amqplib';

import logger from '@middlewares/logger';

import { RabbitClient } from './RabbitClient';

export class RabbitPublisher {
  private client = RabbitClient.getInstance();

  private static instance: RabbitPublisher;

  static getInstance(): RabbitPublisher {
    if (!this.instance) this.instance = new RabbitPublisher();

    return this.instance;
  }

  public async publishOnQueue(
    queue: string,
    msg: string,
    options?: Options.Publish
  ): Promise<void> {
    logger.info(
      `RabbitPublisher::publishOnQueue::send message to ${queue}`,
      JSON.parse(msg)
    );
    await this.client.channel.sendToQueue(queue, Buffer.from(msg), options);
    logger.info(`RabbitPublisher::publishOnQueue::message sent`);
  }
}
