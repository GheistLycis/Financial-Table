import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSavingComponent } from './add-edit-saving.component';

describe('AddEditSavingComponent', () => {
  let component: AddEditSavingComponent;
  let fixture: ComponentFixture<AddEditSavingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSavingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
