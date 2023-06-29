import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralWarningComponent } from './modals/general-warning/general-warning.component';
import { FiltersComponent } from './filters/filters.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../directives/directives.module';



@NgModule({
  declarations: [
    FiltersComponent,
    GeneralWarningComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    DirectivesModule,
  ],
  exports: [
    FiltersComponent,
  ]
})
export class ComponentsModule { }
