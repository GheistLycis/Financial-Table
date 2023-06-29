import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementRoutingModule } from './management-routing.module';
import { YearsModule } from './years/years.module';
import { MonthsModule } from './months/months.module';
import { GroupsModule } from './groups/groups.module';
import { CategoriesModule } from './categories/categories.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    YearsModule,
    MonthsModule,
    CategoriesModule,
    GroupsModule,
  ]
})
export class ManagementModule { }
