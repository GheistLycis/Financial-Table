import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { AuthGuard } from './utils/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: AuthLayoutComponent,
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/default-layout/default-layout.module').then(m => m.DefaultLayoutModule)
      },
    ]
  },
  { 
    path: '**', 
    redirectTo: '',
    pathMatch: 'full'
  },
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }