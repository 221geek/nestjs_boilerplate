import { Module } from '@nestjs/common';
import { ElasticService } from './elastic.service';
import { VaultService } from '../../config/vault.service';

@Module({
  providers: [ElasticService],
  exports: [ElasticService],
})
export class ElasticModule {}