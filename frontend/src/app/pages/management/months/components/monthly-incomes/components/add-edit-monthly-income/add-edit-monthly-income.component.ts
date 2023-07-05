import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import MonthDTO from 'src/app/shared/DTOs/month';
import MonthlyIncomeDTO from 'src/app/shared/DTOs/monthlyIncome';
import MonthlyIncomeForm from 'src/app/shared/classes/MonthlyIncomeForm';
import { MonthlyIncomeService } from 'src/app/shared/services/monthly-income/monthly-income.service';

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
  
  constructor(
    protected activeModal: NgbActiveModal,
    private monthlyIncomeService: MonthlyIncomeService,
  ) { }
  
  ngOnInit(): void {
    if(this.income) {
      this.action = 'editar'
      
      const { value, description, month } = this.income
      
      this.form = {
        value,
        description,
        month: month.id
      }
    }
    else if(this.month) {
      this.form.month = this.month.id
    }
  }
  
  validateForm(): void {    
    this.submitted = true
    
    if(this.formModel.invalid) return
    
    this.submit()
  }
  
  submit(): void {
    const service = this.action == 'adicionar'
      ? (obj: MonthlyIncomeForm) => this.monthlyIncomeService.post(obj)
      : (obj: MonthlyIncomeForm) => this.monthlyIncomeService.put(this.income.id, obj)
    
    service(this.form).subscribe({
      complete: () => this.activeModal.close(true),
      error: () => this.activeModal.close(false)
    })
  }
  
  get f(): FormGroup['controls'] {
    return this.formModel.form.controls
  }
}
