import { Injectable, OnModuleInit } from '@nestjs/common';
import * as vault from 'node-vault';

@Injectable()
export class VaultService implements OnModuleInit {
  private readonly vaultClient: vault.client;
  private secrets: Record<string, any> = {};

  constructor() {
    this.vaultClient = vault({
      apiVersion: 'v1',
      endpoint: process.env.VAULT_ADDR || 'http://localhost:8200',
      token: process.env.VAULT_TOKEN,
    });
  }

  async onModuleInit() {
    try {
      await this.loadSecrets();
    } catch (error) {
      console.error('Failed to load secrets from Vault:', error);
      process.exit(1); // Force application to exit if Vault connection fails
    }
  }

  private async loadSecrets() {
    // Load secrets from specific paths
    const paths = [
      'secret/database',
      'secret/kafka',
      'secret/elasticsearch',
      'secret/redis',
      'secret/keycloak',
    ];

    for (const path of paths) {
      const { data } = await this.vaultClient.read(path);
      this.secrets[path] = data;
    }
  }

  getSecret(path: string, key: string): string {
    const secretPath = `secret/${path}`;
    if (!this.secrets[secretPath] || !this.secrets[secretPath][key]) {
      throw new Error(`Secret not found: ${path}/${key}`);
    }
    return this.secrets[secretPath][key];
  }

  getAllSecrets(path: string): Record<string, any> {
    const secretPath = `secret/${path}`;
    if (!this.secrets[secretPath]) {
      throw new Error(`No secrets found for path: ${path}`);
    }
    return this.secrets[secretPath];
  }
}