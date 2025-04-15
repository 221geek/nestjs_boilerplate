import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VaultService } from '../../config/vault.service';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (vaultService: VaultService) => ({
        uri: vaultService.getSecret('database', 'uri'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [VaultService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}