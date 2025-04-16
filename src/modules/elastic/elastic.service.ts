import { Injectable, OnModuleInit } from "@nestjs/common";
import { Client } from "@elastic/elasticsearch";
import { VaultService } from "../../config/vault/vault.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ElasticService implements OnModuleInit {
	private client: Client;

	constructor(
		private readonly vaultService: VaultService,
		private readonly configService: ConfigService
	) {}

	async onModuleInit() {
		// const node = this.vaultService.getSecret(
		// 	"elasticsearch",
		// 	"ELASTICSEARCH_NODE"
		// );
		// const username = this.vaultService.getSecret(
		// 	"elasticsearch",
		// 	"ELASTICSEARCH_USERNAME"
		// );
		// const password = this.vaultService.getSecret(
		// 	"elasticsearch",
		// 	"ELASTICSEARCH_PASSWORD"
		// );
		const node = this.configService.get("ELASTICSEARCH_NODE");
		const username = this.configService.get("ELASTICSEARCH_USERNAME");
		const password = this.configService.get("ELASTICSEARCH_PASSWORD");

		this.client = new Client({
			node,
			auth: {
				username,
				password,
			},
		});
	}

	async index<T>(index: string, document: T): Promise<string> {
		const result = await this.client.index({
			index,
			document,
		});
		return result._id;
	}

	async search<T>(index: string, query: any): Promise<T[]> {
		const result = await this.client.search<T>({
			index,
			query,
		});
		return result.hits.hits
			.filter((hit) => hit._source !== undefined)
			.map((hit) => hit._source as T);
	}

	async update<T>(
		index: string,
		id: string,
		document: Partial<T>
	): Promise<void> {
		await this.client.update({
			index,
			id,
			doc: document,
		});
	}

	async delete(index: string, id: string): Promise<void> {
		await this.client.delete({
			index,
			id,
		});
	}
}
