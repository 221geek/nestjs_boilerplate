// src/modules/kafka/kafka.module.ts
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { KafkaService } from "./kafka.service";
import { VaultService } from "../../config/vault/vault.service";
import { ConfigService } from "@nestjs/config";

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: "KAFKA_SERVICE",
				inject: [VaultService, ConfigService],
				useFactory: async (
					vaultService: VaultService,
					configService: ConfigService
				) => {
					return {
						transport: Transport.KAFKA,
						options: {
							client: {
								// clientId: vaultService.getSecret("kafka", "KAFKA_CLIENT_ID"),
								// brokers: vaultService.getSecret("kafka", "KAFKA_BROKERS").split(","),
								clientId: configService.get("KAFKA_CLIENT_ID"),
								brokers: configService.get("KAFKA_BROKERS").split(","),
							},
							consumer: {
								// groupId: vaultService.getSecret("kafka", "KAFKA_GROUP_ID"),
								groupId:
									configService.get<string>("KAFKA_GROUP_ID") ||
									"passport-medical-dev",
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
