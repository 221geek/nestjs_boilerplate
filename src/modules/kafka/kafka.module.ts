import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { VaultService } from '../../config/vault.service';
import { KafkaService } from './kafka.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        useFactory: async (vaultService: VaultService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'nest-enterprise',
              brokers: [vaultService.getSecret('kafka', 'brokers')],
            },
            consumer: {
              groupId: 'nest-enterprise-consumer',
            },
          },
        }),
        inject: [VaultService],
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}