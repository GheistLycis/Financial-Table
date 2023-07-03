import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyIncomesComponent } from './monthly-incomes.component';

describe('MonthlyIncomesComponent', () => {
  let component: MonthlyIncomesComponent;
  let fixture: ComponentFixture<MonthlyIncomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyIncomesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyIncomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
