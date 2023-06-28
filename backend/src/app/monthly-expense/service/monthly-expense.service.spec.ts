import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyExpenseService } from './monthly-expense.service';

describe('MonthlyExpenseService', () => {
  let service: MonthlyExpenseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonthlyExpenseService],
    }).compile();

    service = module.get<MonthlyExpenseService>(MonthlyExpenseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
