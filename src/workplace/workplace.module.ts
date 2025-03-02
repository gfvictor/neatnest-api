import { Module } from '@nestjs/common';
import { WorkplaceService } from './workplace.service';
import { WorkplaceController } from './workplace.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [WorkplaceController],
  providers: [WorkplaceService, PrismaService],
})
export class WorkplaceModule {}
