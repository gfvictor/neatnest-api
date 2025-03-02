import { Module } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { HouseholdController } from './household.controller';

@Module({
  controllers: [HouseholdController],
  providers: [HouseholdService],
})
export class HouseholdModule {}
