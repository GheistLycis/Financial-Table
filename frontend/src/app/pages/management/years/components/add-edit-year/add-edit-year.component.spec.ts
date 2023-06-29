import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditYearComponent } from './add-edit-year.component';

describe('AddEditYearComponent', () => {
  let component: AddEditYearComponent;
  let fixture: ComponentFixture<AddEditYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditYearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
