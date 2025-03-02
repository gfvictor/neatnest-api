import { Test, TestingModule } from '@nestjs/testing';
import { HouseholdService } from './household.service';

describe('HouseholdService', () => {
  let service: HouseholdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HouseholdService],
    }).compile();

    service = module.get<HouseholdService>(HouseholdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
