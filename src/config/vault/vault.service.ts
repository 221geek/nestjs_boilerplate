import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as vault from "node-vault";

@Injectable()
export class VaultService implements OnModuleInit {
	private readonly logger = new Logger(VaultService.name);
	private readonly vaultClient: vault.client;
	private secrets: Record<string, any> = {};

	private readonly env: string;
	private readonly basePath: string;
	private readonly secretMountPath: string;

	constructor(private readonly configService: ConfigService) {
		this.env = this.configService.get<string>("NODE_ENV", "development");
		this.basePath = this.env;
		this.secretMountPath = this.configService.get<string>(
			"VAULT_SECRET_PATH",
			"passport"
		);

		const endpoint = this.configService.get<string>("VAULT_ADDR");
		const token = this.configService.get<string>("VAULT_TOKEN");

		if (!endpoint || !token) {
			throw new Error(
				"Vault configuration missing (VAULT_ADDR or VAULT_TOKEN)"
			);
		}

		this.vaultClient = vault({
			apiVersion: "v1",
			endpoint,
			token,
		});
	}

	async onModuleInit() {
		try {
			await this.loadSecrets(["database", "kafka", "elasticsearch"]);
			this.logger.log("✅ Secrets loaded from Vault successfully");
		} catch (error) {
			this.logger.error("❌ Failed to load secrets from Vault:", error);
			process.exit(1);
		}
	}

	async loadSecrets(modules: string[]) {
		for (const name of modules) {
			if (this.secrets[name]) continue;

			const secretPath = `${this.basePath}/${name}`;
			const fullPath = `${this.secretMountPath}/data/${secretPath}`;

			try {
				const response = await this.vaultClient.read(fullPath);

				this.logger.debug(`✅ Loaded secret from ${fullPath}`);
				this.secrets[name] = response.data?.data ?? {};
			} catch (error: any) {
				this.logger.warn(
					`⚠️ Failed to load secret: ${name} (${fullPath}) — ${error?.response?.statusCode ?? error.message}`
				);
				throw error;
			}
		}
	}

	getSecret(module: string, key: string): string {
		const data = this.secrets[module];
		if (!data || !(key in data)) {
			throw new Error(`Secret not found: ${module}/${key}`);
		}
		return data[key];
	}

	getAllSecrets(module: string): Record<string, any> {
		const data = this.secrets[module];
		if (!data) {
			throw new Error(`No secrets found for module: ${module}`);
		}
		return data;
	}
}
