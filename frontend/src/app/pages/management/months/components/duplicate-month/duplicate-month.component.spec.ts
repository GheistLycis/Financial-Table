import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateMonthComponent } from './duplicate-month.component';

describe('DuplicateMonthComponent', () => {
  let component: DuplicateMonthComponent;
  let fixture: ComponentFixture<DuplicateMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuplicateMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicateMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
