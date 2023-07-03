import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMonthlyIncomeComponent } from './add-edit-monthly-income.component';

describe('AddEditMonthlyIncomeComponent', () => {
  let component: AddEditMonthlyIncomeComponent;
  let fixture: ComponentFixture<AddEditMonthlyIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditMonthlyIncomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditMonthlyIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
