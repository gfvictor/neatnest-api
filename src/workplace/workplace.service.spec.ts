import { Test, TestingModule } from '@nestjs/testing';
import { WorkplaceService } from './workplace.service';

describe('WorkplaceService', () => {
  let service: WorkplaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkplaceService],
    }).compile();

    service = module.get<WorkplaceService>(WorkplaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
