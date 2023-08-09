import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavingsComponent } from './savings.component';
import { AddEditSavingComponent } from './components/add-edit-saving/add-edit-saving.component';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PipesModule } from '@pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';



@NgModule({
  declarations: [
    SavingsComponent,
    AddEditSavingComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbTooltipModule,
    NgbProgressbarModule,
    PipesModule,
    NgxMaskModule,
  ]
})
export class SavingsModule { }
