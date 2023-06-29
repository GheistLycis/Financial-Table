import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsComponent } from './groups.component';
import { AddEditGroupComponent } from './components/add-edit-group/add-edit-group.component';



@NgModule({
  declarations: [
    GroupsComponent,
    AddEditGroupComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class GroupsModule { }
