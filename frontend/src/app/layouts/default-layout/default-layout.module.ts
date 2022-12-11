import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { ConfigsComponent } from 'src/app/pages/configs/configs.component';
import { DefaultLayoutRoutingModule } from './default-layout-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { DefaultLayoutComponent } from './default-layout.component';



@NgModule({
  declarations: [
    DefaultLayoutComponent,
    HomeComponent,
    ConfigsComponent,
  ],
  imports: [
    CommonModule,
    DefaultLayoutRoutingModule,
    ComponentsModule,
  ]
})
export class DefaultLayoutModule { }
