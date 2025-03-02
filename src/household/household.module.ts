import { Module } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { HouseholdController } from './household.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [HouseholdController],
  providers: [HouseholdService],
  exports: [HouseholdService],
})
export class HouseholdModule {}
