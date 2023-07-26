import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartsComponent } from 'src/app/pages/charts/charts.component';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { SavingsComponent } from 'src/app/pages/savings/savings.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    component: ChartsComponent,
  },
  {
    path: 'caixinhas',
    component: SavingsComponent,
  },
  {
    path: 'gerenciar',
    children: [
      {
        path: '',
        loadChildren: () => import('../../pages/management/management.module').then(m => m.ManagementModule)
      },
    ]
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultLayoutRoutingModule { }