import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [AuthModule, StorageModule],
  providers: [UserService, JwtAuthGuard],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
