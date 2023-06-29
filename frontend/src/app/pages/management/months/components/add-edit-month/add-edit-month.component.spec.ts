import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditMonthComponent } from './add-edit-month.component';

describe('AddEditMonthComponent', () => {
  let component: AddEditMonthComponent;
  let fixture: ComponentFixture<AddEditMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
