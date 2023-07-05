import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralWarningComponent } from './modals/general-warning/general-warning.component';
import { FiltersComponent } from './filters/filters.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../directives/directives.module';
import { TooltipComponent } from './tooltip/tooltip.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    FiltersComponent,
    GeneralWarningComponent,
    TooltipComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    DirectivesModule,
    NgbTooltipModule,
  ],
  exports: [
    FiltersComponent,
    TooltipComponent,
  ]
})
export class ComponentsModule { }
