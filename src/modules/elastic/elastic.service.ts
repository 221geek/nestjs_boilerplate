import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { VaultService } from '../../config/vault.service';

@Injectable()
export class ElasticService implements OnModuleInit {
  private client: Client;

  constructor(private readonly vaultService: VaultService) {}

  async onModuleInit() {
    const node = this.vaultService.getSecret('elasticsearch', 'node');
    const username = this.vaultService.getSecret('elasticsearch', 'username');
    const password = this.vaultService.getSecret('elasticsearch', 'password');

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
      .filter(hit => hit._source !== undefined)
      .map((hit) => hit._source as T);
  }

  async update<T>(index: string, id: string, document: Partial<T>): Promise<void> {
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