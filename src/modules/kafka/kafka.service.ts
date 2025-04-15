import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { VaultService } from '../../config/vault.service';

@Injectable()
export class KafkaService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'nest-enterprise',
        brokers: [],  // Will be populated in onModuleInit
      },
      consumer: {
        groupId: 'nest-enterprise-consumer',
      },
    },
  })
  private client: ClientKafka;

  constructor(private readonly vaultService: VaultService) {}

  async onModuleInit() {
    const brokers = this.vaultService.getSecret('kafka', 'brokers').split(',');
    this.client.connect();
  }

  async emit<T>(topic: string, message: T): Promise<void> {
    try {
      await this.client.emit(topic, message).toPromise();
    } catch (error) {
      throw new Error(`Failed to emit message to topic ${topic}: ${error.message}`);
    }
  }

  async subscribe<T>(topic: string, callback: (message: T) => Promise<void>): Promise<void> {
    try {
      await this.client.subscribe(topic, callback);
    } catch (error) {
      throw new Error(`Failed to subscribe to topic ${topic}: ${error.message}`);
    }
  }
}