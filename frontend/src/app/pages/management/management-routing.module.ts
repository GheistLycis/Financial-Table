import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YearsComponent } from './years/years.component';
import { MonthsComponent } from './months/months.component';

const routes: Routes = [
  {
    path: 'anos',
    component: YearsComponent,
  },
  {
    path: 'meses',
    component: MonthsComponent,
  },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }