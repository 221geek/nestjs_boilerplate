import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { VaultService } from "../../config/vault/vault.service";
import { DatabaseService } from "./database.service";
import { ConfigService } from "@nestjs/config";

@Module({
	imports: [
		MongooseModule.forRootAsync({
			useFactory: async (
				vaultService: VaultService,
				configService: ConfigService
			) => {
				return {
					// uri: vaultService.getSecret("database", "DATASOURCE_MONGO_URI"),
					uri: configService.get<string>("DATASOURCE_MONGO_URI"),
					useNewUrlParser: true,
					useUnifiedTopology: true,
				};
			},
			inject: [VaultService, ConfigService],
		}),
	],
	providers: [DatabaseService],
	exports: [DatabaseService],
})
export class DatabaseModule {}
