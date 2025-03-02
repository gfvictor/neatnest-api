import { Module } from '@nestjs/common';
import { WorkplaceService } from './workplace.service';
import { WorkplaceController } from './workplace.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WorkplaceController],
  providers: [WorkplaceService, PrismaService],
  exports: [WorkplaceService],
})
export class WorkplaceModule {}
