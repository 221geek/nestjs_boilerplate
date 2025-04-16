import { Module } from "@nestjs/common";
import { KafkaConfigService } from "./services/kafka-config.service";
import { VaultService } from "@/config/vault/vault.service";

@Module({
	providers: [KafkaConfigService, VaultService],
	exports: [KafkaConfigService],
})
export class KafkaConfigModule {}
