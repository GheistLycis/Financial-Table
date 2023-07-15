import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import CategoryDTO from 'src/app/shared/DTOs/category';
import MonthDTO from 'src/app/shared/DTOs/month';
import CategoryForm from 'src/app/shared/classes/CategoryForm';
import { CategoryService } from 'src/app/shared/services/category/category.service';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.scss']
})
export class AddEditCategoryComponent implements OnInit {
  @Input() month?: MonthDTO
  @Input() category?: CategoryDTO
  @ViewChild('formModel') formModel!: NgForm
  form = new CategoryForm()
  action: 'editar' | 'adicionar' = 'adicionar'
  submitted = false
  
  constructor(
    protected activeModal: NgbActiveModal,
    private categoryService: CategoryService,
  ) { }
  
  ngOnInit(): void {
    if(this.category) {
      this.action = 'editar'
      
      const { name, percentage, color, month } = this.category
      
      this.form = {
        name,
        percentage,
        color,
        month: month.id
      }
    }
    else if(this.month) {
      this.form.month = this.month.id
      this.form.color = '#000'
    }
  }
  
  validateForm(): void {
    this.submitted = true
    
    this.form.color = this.form.color.toString()
    
    this.submit()
  }
  
  submit(): void {
    const service = this.action == 'adicionar'
      ? (obj: CategoryForm) => this.categoryService.post(obj)
      : (obj: CategoryForm) => this.categoryService.put(this.category.id, obj)
    
    service(this.form).subscribe({
      complete: () => this.activeModal.close(true),
      error: () => this.activeModal.close(false)
    })
  }
  
  get f(): FormGroup['controls'] {
    return this.formModel.form.controls
  }
}
