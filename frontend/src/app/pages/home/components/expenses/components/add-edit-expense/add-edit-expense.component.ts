import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, map, tap } from 'rxjs';
import ExpenseDTO from '@DTOs/expense';
import YearDTO from '@DTOs/year';
import ExpenseForm from '@classes/ExpenseForm';
import { ExpenseService } from '@services/expense/expense.service';
import { TagService } from '@services/tag/tag.service';
import CategoryDTO from '@DTOs/category';

@Component({
  selector: 'app-add-edit-expense',
  templateUrl: './add-edit-expense.component.html',
  styleUrls: ['./add-edit-expense.component.scss']
})
export class AddEditExpenseComponent implements OnInit {
  @Input() expense?: ExpenseDTO
  @Input() year!: YearDTO['id']
  @ViewChild('dateInput') dateInput!: NgModel
  @ViewChild('formModel') formModel!: NgForm
  form = new ExpenseForm()
  category$ = new Subject<CategoryDTO | undefined>()
  tags$ = this.tagService.list().pipe(map(({ data }) => data))
  action: 'editar' | 'adicionar' = 'adicionar'
  submitted = false
  loading = false
  dateRange = {
    min: undefined,
    max: undefined
  }
  
  constructor(
    protected activeModal: NgbActiveModal,
    private expenseService: ExpenseService,
    private tagService: TagService,
    public router: Router,
  ) { 
    this.category$.pipe(
      tap(category => {
        if(category) {
          const { id, month } = category
          const maxDate = new Date().getMonth() == month.month-1
            ? new Date(month.year.year, month.month-1, new Date().getDate())
            : new Date(month.year.year, month.month, 0)

          this.dateRange = {
            min: new Date(month.year.year, month.month-1, 1).toISOString().split('T')[0],
            max: maxDate.toISOString().split('T')[0]
          }

          this.form.category = id
        }
        else {
          this.form.category = undefined
          this.form.date = undefined
        }
      })
    ).subscribe()
  }
  
  ngOnInit(): void {
    if(this.expense) {
      this.action = 'editar'
      this.year = this.expense.category.month.year.id
      
      const { id, value, date, description, category } = this.expense

      this.category$.next(category)
      
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
      this.form.date = this.dateRange.max
    }
  }
  
  validateForm(): void {    
    this.submitted = true

    if(this.formModel.invalid) return
    
    this.submit()
  }
  
  submit(): void {
    const service = this.action == 'adicionar'
      ? this.expenseService.post(this.form)
      : this.expenseService.put(this.expense.id, this.form)
    
    this.loading = true
    
    service.subscribe({
      complete: () => this.activeModal.close(true),
      error: () => this.loading = false,
    })
  }
  
  get f(): FormGroup['controls'] {
    return this.formModel?.form?.controls
  }
}
