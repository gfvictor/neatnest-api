import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
