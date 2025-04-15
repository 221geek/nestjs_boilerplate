import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { VaultService } from '../../config/vault.service';

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}