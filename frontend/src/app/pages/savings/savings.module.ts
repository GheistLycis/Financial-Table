import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavingsComponent } from './savings.component';
import { AddEditSavingComponent } from './components/add-edit-saving/add-edit-saving.component';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { TimeLeftPipe } from '@pipes/time-left/time-left.pipe';
import { RoundPipe } from '@pipes/round/round.pipe';



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
    NgxMaskModule,
    TimeLeftPipe,
    RoundPipe,
  ]
})
export class SavingsModule { }
