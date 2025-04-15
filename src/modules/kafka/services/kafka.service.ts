import { VaultService } from "@/config/vault.service";
import {
	Injectable,
	OnModuleInit,
	OnApplicationShutdown,
	Logger,
} from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import {
	Kafka,
	Producer,
	Consumer,
	KafkaConfig,
	Partitioners,
	EachMessagePayload,
} from "kafkajs";

@Injectable()
export class KafkaService implements OnModuleInit, OnApplicationShutdown {
	private readonly logger = new Logger(KafkaService.name);
	private kafka: Kafka;
	private producer: Producer;
	private consumer: Consumer;

	constructor(private readonly vaultService: VaultService) {}

	async onModuleInit() {
		try {
			const clientId = this.vaultService.getSecret("kafka", "client_id");
			const brokerUrl = new URL(
				this.vaultService.getSecret("kafka", "brokers")
			);
			const timeout = parseInt(
				this.vaultService.getSecret("kafka", "connection_timeout"),
				10
			);
			const retryDelay = parseInt(
				this.vaultService.getSecret("kafka", "retry_delay"),
				10
			);
			const retryAttempts = parseInt(
				this.vaultService.getSecret("kafka", "retry_attempts"),
				10
			);
			const consumerGroupId = this.vaultService.getSecret("kafka", "group_id");

			const kafkaConfig: KafkaConfig = {
				clientId,
				brokers: [`${brokerUrl.hostname}:${brokerUrl.port}`],
				connectionTimeout: timeout,
				retry: {
					initialRetryTime: retryDelay,
					retries: retryAttempts,
				},
			};

			this.logger.log(
				`Initializing Kafka with brokers: ${kafkaConfig.brokers}`
			);
			this.kafka = new Kafka(kafkaConfig);

			this.producer = this.kafka.producer({
				createPartitioner: Partitioners.LegacyPartitioner,
			});

			this.consumer = this.kafka.consumer({
				groupId: consumerGroupId,
			});

			this.logger.log("Connecting to Kafka as Producer...");
			await this.producer.connect();
			this.logger.log("Successfully connected to Kafka as Producer");
		} catch (error) {
			this.logger.error("Kafka initialization failed", error.stack);
		}
	}

	async onApplicationShutdown() {
		try {
			this.logger.log("Disconnecting from Kafka...");
			await this.producer.disconnect();
			this.logger.log("Successfully disconnected from Kafka Producer");

			if (this.consumer) {
				this.logger.log("Disconnecting Kafka Consumer...");
				await this.consumer.disconnect();
				this.logger.log("Successfully disconnected Kafka Consumer");
			}
		} catch (error) {
			this.logger.error("Error disconnecting from Kafka", error.stack);
		}
	}

	@OnEvent("kafka.emit")
	async emit(payload: { topic: string; message: any; key?: string }) {
		const { message, topic, key } = payload;
		try {
			this.logger.debug(`Sending message to topic ${topic}`, { key, message });
			await this.producer.send({
				topic,
				messages: [
					{
						key: key || "",
						value: JSON.stringify(message),
					},
				],
			});
			this.logger.debug(`Successfully sent message to topic ${topic}`);
		} catch (error) {
			this.logger.error(`Error sending message to topic ${topic}`, error.stack);
			throw error;
		}
	}

	async subscribe(
		topic: string,
		onMessage: (payload: EachMessagePayload) => Promise<void>
	) {
		try {
			this.logger.log(`Connecting Kafka Consumer to topic: ${topic}...`);
			await this.consumer.connect();
			await this.consumer.subscribe({ topic, fromBeginning: true });

			await this.consumer.run({
				eachMessage: async (payload: EachMessagePayload) => {
					this.logger.debug(`Received message from topic ${topic}`);
					await onMessage(payload);
				},
			});
			this.logger.log(`Successfully subscribed to topic: ${topic}`);
		} catch (error) {
			this.logger.error(`Error subscribing to topic ${topic}`, error.stack);
		}
	}
}
