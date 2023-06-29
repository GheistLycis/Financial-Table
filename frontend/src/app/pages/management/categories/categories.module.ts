import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { AddEditCategoryComponent } from './components/add-edit-category/add-edit-category.component';



@NgModule({
  declarations: [
    CategoriesComponent,
    AddEditCategoryComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class CategoriesModule { }
