import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyIncomeController } from './monthly-income.controller';

describe('MonthlyIncomeController', () => {
  let controller: MonthlyIncomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyIncomeController],
    }).compile();

    controller = module.get<MonthlyIncomeController>(MonthlyIncomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
