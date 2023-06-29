import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YearsComponent } from './years.component';
import { AddEditYearComponent } from './components/add-edit-year/add-edit-year.component';



@NgModule({
  declarations: [
    YearsComponent,
    AddEditYearComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class YearsModule { }
