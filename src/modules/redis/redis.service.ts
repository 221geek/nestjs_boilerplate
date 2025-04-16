import { Injectable, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";
import { VaultService } from "../../config/vault/vault.service";

@Injectable()
export class RedisService implements OnModuleInit {
	private client: Redis;

	constructor(private readonly vaultService: VaultService) {}

	async onModuleInit() {
		const host = this.vaultService.getSecret("redis", "REDIS_HOST");
		const port = parseInt(
			this.vaultService.getSecret("redis", "REDIS_PORT"),
			10
		);
		const password = this.vaultService.getSecret("redis", "REDIS_PASSWORD");

		this.client = new Redis({
			host,
			port,
			password,
			retryStrategy: (times) => Math.min(times * 50, 2000),
		});
	}

	async set(key: string, value: string, ttl?: number): Promise<void> {
		if (ttl) {
			await this.client.set(key, value, "EX", ttl);
		} else {
			await this.client.set(key, value);
		}
	}

	async get(key: string): Promise<string | null> {
		return this.client.get(key);
	}

	async del(key: string): Promise<void> {
		await this.client.del(key);
	}

	async healthCheck(): Promise<boolean> {
		try {
			await this.client.ping();
			return true;
		} catch (error) {
			return false;
		}
	}
}
