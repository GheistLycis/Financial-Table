import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthNamePipe } from './month-name/month-name.pipe';
import { TimeLeftPipe } from './time-left/time-left.pipe';
import { RoundPipe } from './round/round.pipe';


@NgModule({
  declarations: [
    MonthNamePipe,
    TimeLeftPipe,
    RoundPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MonthNamePipe,
    TimeLeftPipe,
    RoundPipe,
  ]
})
export class PipesModule { }
