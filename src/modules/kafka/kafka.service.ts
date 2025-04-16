import { Injectable, OnModuleInit } from "@nestjs/common";
import { Client, ClientKafka, Transport } from "@nestjs/microservices";
import { VaultService } from "../../config/vault/vault.service";

@Injectable()
export class KafkaService implements OnModuleInit {
	private client: ClientKafka;

	constructor(private readonly vaultService: VaultService) {}

	async onModuleInit() {
		const brokers = this.vaultService
			.getSecret("kafka", "KAFKA_BROKERS")
			.split(",");
		this.client.connect();
	}

	async emit<T>(topic: string, message: T): Promise<void> {
		try {
			await this.client.emit(topic, message).toPromise();
		} catch (error) {
			throw new Error(
				`Failed to emit message to topic ${topic}: ${error.message}`
			);
		}
	}

	// async subscribe<T>(topic: string, callback: (message: T) => Promise<void>): Promise<void> {
	//   try {
	//     await this.client.subscribeToResponseOf(topic);
	//   } catch (error) {
	//     throw new Error(`Failed to subscribe to topic ${topic}: ${error.message}`);
	//   }
	// }
}
