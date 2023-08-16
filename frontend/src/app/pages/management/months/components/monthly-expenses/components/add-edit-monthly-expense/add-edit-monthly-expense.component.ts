import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import MonthDTO from '@DTOs/month';
import MonthlyExpenseDTO from '@DTOs/monthlyExpense';
import MonthlyExpenseForm from '@classes/MonthlyExpenseForm';
import { MonthlyExpenseService } from '@services/monthly-expense/monthly-expense.service';

@Component({
  selector: 'app-add-edit-monthly-expense',
  templateUrl: './add-edit-monthly-expense.component.html',
  styleUrls: ['./add-edit-monthly-expense.component.scss']
})
export class AddEditMonthlyExpenseComponent {
  @Input() month?: MonthDTO
  @Input() expense?: MonthlyExpenseDTO
  @ViewChild('formModel') formModel!: NgForm
  form = new MonthlyExpenseForm()
  action: 'editar' | 'adicionar' = 'adicionar'
  submitted = false
  loading = false
  dateRange = {
    min: undefined,
    max: undefined
  }
  
  constructor(
    protected activeModal: NgbActiveModal,
    private monthlyExpenseService: MonthlyExpenseService,
  ) { }
  
  ngOnInit(): void {
    if(this.expense) {
      this.action = 'editar'
      
      const { value, date, description, month } = this.expense
      
      this.form = {
        value,
        date,
        description,
        month: month.id
      }

      this.dateRange = {
        min: new Date(month.year.year, month.month-1, 1).toISOString().split('T')[0],
        max: new Date(month.year.year, month.month, 0).toISOString().split('T')[0]
      }
    }
    else if(this.month) {
      this.form.month = this.month.id

      this.dateRange = {
        min: new Date(this.month.year.year, this.month.month-1, 1).toISOString().split('T')[0],
        max: new Date(this.month.year.year, this.month.month, 0).toISOString().split('T')[0]
      }
    }
  }
  
  validateForm(): void {    
    this.submitted = true
    
    if(this.formModel.invalid) return
    
    if(`${this.form.date}` == '') this.form.date = null
    
    this.submit()
  }
  
  submit(): void {
    const service = this.action == 'adicionar'
      ? (obj: MonthlyExpenseForm) => this.monthlyExpenseService.post(obj)
      : (obj: MonthlyExpenseForm) => this.monthlyExpenseService.put(this.expense.id, obj)
    
    this.loading = true
      
    service(this.form).subscribe({
      complete: () => this.activeModal.close(true),
      error: () => this.loading = false,
    })
  }
  
  get f(): FormGroup['controls'] {
    return this.formModel.form.controls
  }
}
