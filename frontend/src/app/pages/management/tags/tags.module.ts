import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsComponent } from './tags.component';
import { AddEditTagComponent } from './components/add-edit-tag/add-edit-tag.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TagsComponent,
    AddEditTagComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbTooltipModule,
  ]
})
export class TagsModule { }
