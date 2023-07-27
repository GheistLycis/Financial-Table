import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesChartComponent } from './categories-chart.component';

describe('CategoriesChartComponent', () => {
  let component: CategoriesChartComponent;
  let fixture: ComponentFixture<CategoriesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriesChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
