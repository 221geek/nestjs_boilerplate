// src/modules/kafka/kafka.module.ts
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { VaultService } from "../../config/vault/vault.service";
import { KafkaService } from "./services/kafka.service";

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: "KAFKA_SERVICE",
				inject: [VaultService],
				useFactory: async (vaultService: VaultService) => {
					await vaultService.loadSecrets(["kafka"]);
					return {
						transport: Transport.KAFKA,
						options: {
							client: {
								clientId: vaultService.getSecret("kafka", "KAFKA_CLIENT_ID"),
								brokers: vaultService
									.getSecret("kafka", "KAFKA_BROKERS")
									.split(","),
							},
							consumer: {
								groupId: vaultService.getSecret("kafka", "KAFKA_GROUP_ID"),
							},
						},
					};
				},
			},
		]),
	],
	providers: [KafkaService],
	exports: [KafkaService],
})
export class KafkaModule {}
