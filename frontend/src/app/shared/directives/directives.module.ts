import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollDetectionDirective } from './scroll-detection/scroll-detection.directive';
import { SortableHeaderDirective } from './sortable-header/sortable-header.directive';



@NgModule({
  declarations: [
    ScrollDetectionDirective,
    SortableHeaderDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ScrollDetectionDirective,
    SortableHeaderDirective,
  ]
})
export class DirectivesModule { }
