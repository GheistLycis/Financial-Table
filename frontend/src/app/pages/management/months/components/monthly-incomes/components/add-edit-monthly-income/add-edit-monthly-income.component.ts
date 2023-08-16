import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import MonthDTO from '@DTOs/month';
import MonthlyIncomeDTO from '@DTOs/monthlyIncome';
import MonthlyIncomeForm from '@classes/MonthlyIncomeForm';
import { MonthlyIncomeService } from '@services/monthly-income/monthly-income.service';

@Component({
  selector: 'app-add-edit-monthly-income',
  templateUrl: './add-edit-monthly-income.component.html',
  styleUrls: ['./add-edit-monthly-income.component.scss']
})
export class AddEditMonthlyIncomeComponent {
  @Input() month?: MonthDTO
  @Input() income?: MonthlyIncomeDTO
  @ViewChild('formModel') formModel!: NgForm
  form = new MonthlyIncomeForm()
  action: 'editar' | 'adicionar' = 'adicionar'
  submitted = false
  loading = false
  dateRange = {
    min: undefined,
    max: undefined
  }
  
  constructor(
    protected activeModal: NgbActiveModal,
    private monthlyIncomeService: MonthlyIncomeService,
  ) { }
  
  ngOnInit(): void {
    if(this.income) {
      this.action = 'editar'
      
      const { value, date, description, month } = this.income
      
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
      ? (obj: MonthlyIncomeForm) => this.monthlyIncomeService.post(obj)
      : (obj: MonthlyIncomeForm) => this.monthlyIncomeService.put(this.income.id, obj)
    
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
