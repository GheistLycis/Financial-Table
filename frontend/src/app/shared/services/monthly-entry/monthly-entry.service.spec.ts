import { TestBed } from '@angular/core/testing';

import { MonthlyEntryService } from './monthly-entry.service';

describe('MonthlyEntryService', () => {
  let service: MonthlyEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthlyEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
