import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'login',
    component: AuthLayoutComponent,
    loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule),
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./layouts/default-layout/default-layout.module').then(m => m.DefaultLayoutModule),
  },
  { 
    path: '**', 
    component: NotFoundComponent,
  },
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }