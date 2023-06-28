import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyExpenseController } from './monthly-expense.controller';

describe('MonthlyExpenseController', () => {
  let controller: MonthlyExpenseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyExpenseController],
    }).compile();

    controller = module.get<MonthlyExpenseController>(MonthlyExpenseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
