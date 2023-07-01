import { Component, Input, ViewChild } from '@angular/core';
import MonthDTO from 'src/app/shared/DTOs/month';

@Component({
  selector: 'app-add-edit-month',
  templateUrl: './add-edit-month.component.html',
  styleUrls: ['./add-edit-month.component.scss']
})
export class AddEditMonthComponent {
  @Input() month?: MonthDTO
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
