import { Module } from '@nestjs/common';
import { VaultService } from './config/vault.service';
import { DatabaseModule } from './modules/database/database.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { ElasticModule } from './modules/elastic/elastic.module';
import { RedisModule } from './modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { CaslModule } from './modules/casl/casl.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    KafkaModule,
    ElasticModule,
    RedisModule,
    AuthModule,
    CaslModule,
    UsersModule,
  ],
  providers: [VaultService],
})
export class AppModule {}