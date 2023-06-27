import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralWarningComponent } from './general-warning.component';

describe('GeneralWarningComponent', () => {
  let component: GeneralWarningComponent;
  let fixture: ComponentFixture<GeneralWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralWarningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
