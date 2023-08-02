import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YearsComponent } from './years.component';
import { AddEditYearComponent } from './components/add-edit-year/add-edit-year.component';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from 'src/app/shared/components/components.module';



@NgModule({
  declarations: [
    YearsComponent,
    AddEditYearComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbTooltipModule,
    ComponentsModule,
  ]
})
export class YearsModule { }
