import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollDetectionDirective } from './scroll-detection/scroll-detection.directive';
import { SortableTableDirective } from './sortable-table/sortable-table.directive';



@NgModule({
  declarations: [
    ScrollDetectionDirective,
    SortableTableDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ScrollDetectionDirective,
    SortableTableDirective,
  ]
})
export class DirectivesModule { }
