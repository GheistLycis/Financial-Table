import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMonthlyExpenseComponent } from './add-edit-monthly-expense.component';

describe('AddEditMonthlyExpenseComponent', () => {
  let component: AddEditMonthlyExpenseComponent;
  let fixture: ComponentFixture<AddEditMonthlyExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditMonthlyExpenseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditMonthlyExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
