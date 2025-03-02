import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SectionController],
  providers: [SectionService],
  exports: [SectionService],
})
export class SectionModule {}
