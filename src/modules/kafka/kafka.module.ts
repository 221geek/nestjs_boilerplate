import { Module } from "@nestjs/common";
import { KafkaService } from "./services/kafka.service";
import { ExempleConsumer } from "./consumer/exemple.consumer";

@Module({
	imports: [],
	providers: [KafkaService, ExempleConsumer],
})
export class KafkaModule {}
