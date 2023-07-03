import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementRoutingModule } from './management-routing.module';
import { YearsModule } from './years/years.module';
import { MonthsModule } from './months/months.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    YearsModule,
    MonthsModule,
  ]
})
export class ManagementModule { }
