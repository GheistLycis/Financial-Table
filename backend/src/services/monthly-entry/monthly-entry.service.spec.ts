import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyEntryService } from './monthly-entry.service';

describe('MonthlyEntryService', () => {
  let service: MonthlyEntryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonthlyEntryService],
    }).compile();

    service = module.get<MonthlyEntryService>(MonthlyEntryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
