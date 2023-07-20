import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollDetectionDirective } from './scroll-detection/scroll-detection.directive';



@NgModule({
  declarations: [
    ScrollDetectionDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ScrollDetectionDirective,
  ]
})
export class DirectivesModule { }
