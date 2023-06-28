import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YearsComponent } from './years/years.component';
import { MonthsComponent } from './months/months.component';
import { CategoriesComponent } from './categories/categories.component';
import { GroupsComponent } from './groups/groups.component';

const routes: Routes = [
  {
    path: 'anos',
    component: YearsComponent,
  },
  {
    path: 'meses',
    component: MonthsComponent,
  },
  {
    path: 'categorias',
    component: CategoriesComponent,
  },
  {
    path: 'grupos',
    component: GroupsComponent,
  },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }