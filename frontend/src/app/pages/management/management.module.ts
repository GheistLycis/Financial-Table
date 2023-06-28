import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementRoutingModule } from './management-routing.module';
import { YearsComponent } from './years/years.component';
import { MonthsComponent } from './months/months.component';
import { CategoriesComponent } from './categories/categories.component';
import { GroupsComponent } from './groups/groups.component';


@NgModule({
  declarations: [
    YearsComponent,
    MonthsComponent,
    CategoriesComponent,
    GroupsComponent,
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
  ]
})
export class ManagementModule { }
