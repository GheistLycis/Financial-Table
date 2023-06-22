import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLayoutRoutingModule } from './default-layout-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { DefaultLayoutComponent } from './default-layout.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/utils/directives/directives.module';
import { MatTabsModule } from '@angular/material/tabs';



@NgModule({
  declarations: [
    DefaultLayoutComponent,
  ],
  imports: [
    CommonModule,
    DefaultLayoutRoutingModule,
    ComponentsModule,
    DirectivesModule,
    MatTabsModule,
    FormsModule,
    NgSelectModule,
  ]
})
export class DefaultLayoutModule { }
