import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyIncomeService } from './monthly-income.service';

describe('MonthlyIncomeService', () => {
  let service: MonthlyIncomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonthlyIncomeService],
    }).compile();

    service = module.get<MonthlyIncomeService>(MonthlyIncomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
