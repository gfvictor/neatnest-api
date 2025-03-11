import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, ConfigModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
