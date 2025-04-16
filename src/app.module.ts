import { Module } from "@nestjs/common";
import { DatabaseModule } from "./modules/database/database.module";
import { KafkaModule } from "./modules/kafka/kafka.module";
import { ElasticModule } from "./modules/elastic/elastic.module";
import { RedisModule } from "./modules/redis/redis.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CaslModule } from "./modules/casl/casl.module";
import { UsersModule } from "./modules/users/users.module";
import { VaultModule } from "./config/vault/vault.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		VaultModule,
		AuthModule,
		CaslModule,
		UsersModule,
		KafkaModule,
		DatabaseModule,
		ElasticModule,
		// RedisModule,
	],
	providers: [],
})
export class AppModule {}
