import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import ExpenseDTO from 'src/app/shared/DTOs/expense';
import YearDTO from 'src/app/shared/DTOs/year';
import ExpenseForm from 'src/app/shared/classes/ExpenseForm';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';

@Component({
  selector: 'app-add-edit-expense',
  templateUrl: './add-edit-expense.component.html',
  styleUrls: ['./add-edit-expense.component.scss']
})
export class AddEditExpenseComponent implements OnInit {
  @Input() expense?: ExpenseDTO
  @Input() year!: YearDTO['id']
  @ViewChild('formModel') formModel!: NgForm
  form = new ExpenseForm()
  action: 'editar' | 'adicionar' = 'adicionar'
  submitted = false
  
  constructor(
    protected activeModal: NgbActiveModal,
    private expenseService: ExpenseService,
  ) { }
  
  ngOnInit(): void {
    if(this.expense) {
      this.action = 'editar'
      this.year = this.expense.group.category.month.year.id
      
      const { value, date, description, group } = this.expense
      
      this.form = {
        value,
        date,
        description,
        group: group.id
      }
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
    
    service(this.form).subscribe({
      complete: () => this.activeModal.close(true),
      error: () => this.activeModal.close(false)
    })
  }
}
