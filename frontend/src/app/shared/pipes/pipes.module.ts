import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthNamePipe } from './month-name/month-name.pipe';


@NgModule({
  declarations: [
    MonthNamePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MonthNamePipe,
  ]
})
export class PipesModule { }
