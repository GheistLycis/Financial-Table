import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthNamePipe } from './month-name/month-name.pipe';
import { TimeLeftPipe } from './time-left/time-left.pipe';


@NgModule({
  declarations: [
    MonthNamePipe,
    TimeLeftPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MonthNamePipe,
    TimeLeftPipe,
  ]
})
export class PipesModule { }
