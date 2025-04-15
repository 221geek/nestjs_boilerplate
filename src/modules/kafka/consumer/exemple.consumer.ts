import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { KafkaService } from "../services/kafka.service";

@Injectable()
export class ExempleConsumer implements OnModuleInit {
	private readonly logger = new Logger(ExempleConsumer.name);

	constructor(private readonly kafkaService: KafkaService) {}

	async onModuleInit() {
		console.log("EnrolmentConsumer onModuleInit", "exemple");
		await this.kafkaService.subscribe(
			"default_topic",
			async ({ topic, partition, message }) => {
				try {
					this.logger.debug(
						`Message reçu sur ${topic} [partition ${partition}]: ${message.value}`
					);
				} catch (error) {
					this.logger.error(
						`Erreur lors de la réception du message: ${error.message}`,
						error.stack
					);
				}
			}
		);
	}
}
