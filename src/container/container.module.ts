import { Module } from '@nestjs/common';
import { ContainerService } from './container.service';
import { ContainerController } from './container.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ContainerController],
  providers: [ContainerService],
  exports: [ContainerModule],
})
export class ContainerModule {}
