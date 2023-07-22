import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs';
import ExpenseDTO from 'src/app/shared/DTOs/expense';
import YearDTO from 'src/app/shared/DTOs/year';
import ExpenseForm from 'src/app/shared/classes/ExpenseForm';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';
import { TagService } from 'src/app/shared/services/tag/tag.service';

@Component({
  selector: 'app-add-edit-expense',
  templateUrl: './add-edit-expense.component.html',
  styleUrls: ['./add-edit-expense.component.scss']
})
export class AddEditExpenseComponent implements OnInit {
  @Input() expense?: ExpenseDTO
  @Input() year!: YearDTO['id']
  @ViewChild('formModel') formModel!: NgForm
  tags$ = this.tagService.list().pipe(map(({ data }) => data))
  form = new ExpenseForm()
  action: 'editar' | 'adicionar' = 'adicionar'
  submitted = false
  loading = false
  value
  
  constructor(
    protected activeModal: NgbActiveModal,
    private expenseService: ExpenseService,
    private tagService: TagService,
    public router: Router,
  ) { }
  
  ngOnInit(): void {
    if(this.expense) {
      this.action = 'editar'
      this.year = this.expense.category.month.year.id
      
      const { id, value, date, description, category } = this.expense
      
      this.tagService.list({ expense: id }).subscribe(({ data }) => {
        this.form = {
          value,
          date,
          description,
          category: category.id,
          tags: data
        }
      })
    }
    else {
      this.form.date = new Date().toISOString().split('T')[0]
    }
  }
  
  validateForm(): void {    
    this.submitted = true
    
    if(this.formModel.invalid) return
    
    this.submit()
  }
  
  submit(): void {
    const service = this.action == 'adicionar'
      ? (obj: ExpenseForm) => this.expenseService.post(obj)
      : (obj: ExpenseForm) => this.expenseService.put(this.expense.id, obj)
    
    this.loading = true
    
    service(this.form).subscribe({
      complete: () => this.activeModal.close(true),
      error: () => this.activeModal.close(false)
    })
  }
  
  get f(): FormGroup['controls'] {
    return this.formModel.controls
  }
}
