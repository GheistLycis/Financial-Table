import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyEntryComponent } from './monthly-entry.component';

describe('MonthlyEntryComponent', () => {
  let component: MonthlyEntryComponent;
  let fixture: ComponentFixture<MonthlyEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
