import { Injectable } from "@nestjs/common";
import { Transport, KafkaOptions } from "@nestjs/microservices";
import { VaultService } from "../../../config/vault/vault.service";

@Injectable()
export class KafkaConfigService {
	constructor(private readonly vaultService: VaultService) {}

	getKafkaOptions(): KafkaOptions {
		const clientId = this.vaultService.getSecret("kafka", "KAFKA_CLIENT_ID");
		const brokers = this.vaultService
			.getSecret("kafka", "KAFKA_BROKERS")
			.split(",");
		const groupId = this.vaultService.getSecret("kafka", "KAFKA_GROUP_ID");

		return {
			transport: Transport.KAFKA,
			options: {
				client: { clientId, brokers },
				consumer: { groupId },
			},
		} as KafkaOptions;
	}
}
