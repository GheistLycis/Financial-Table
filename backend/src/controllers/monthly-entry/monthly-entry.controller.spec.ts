import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyEntryController } from './monthly-entry.controller';

describe('MonthlyEntryController', () => {
  let controller: MonthlyEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyEntryController],
    }).compile();

    controller = module.get<MonthlyEntryController>(MonthlyEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
