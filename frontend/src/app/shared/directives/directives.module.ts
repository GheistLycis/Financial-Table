import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthNameDirective } from './month-name/month-name.directive';


@NgModule({
  declarations: [
    MonthNameDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MonthNameDirective,
  ]
})
export class DirectivesModule { }
