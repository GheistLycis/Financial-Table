import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import MonthDTO from 'src/app/shared/DTOs/month';
import MonthlyExpenseDTO from 'src/app/shared/DTOs/monthlyExpense';
import { MonthlyExpenseService } from 'src/app/shared/services/monthly-expense/monthly-expense.service';
import { AddEditMonthlyExpenseComponent } from './components/add-edit-monthly-expense/add-edit-monthly-expense.component';
import { GeneralWarningComponent } from 'src/app/shared/components/modals/general-warning/general-warning.component';
import { monthNames } from 'src/app/shared/enums/monthNames';

@Component({
  selector: 'app-monthly-expenses',
  templateUrl: './monthly-expenses.component.html',
  styleUrls: ['./monthly-expenses.component.scss']
})
export class MonthlyExpensesComponent implements OnInit {
  @Input() month!: MonthDTO
  expenses: MonthlyExpenseDTO[] = []
  
  constructor(
    private monthlyExpenseService: MonthlyExpenseService,
    private modalService: NgbModal,
    protected activeModal: NgbActiveModal,
    private toastr: ToastrService,
  ) { }
  
  ngOnInit(): void {
    this.listExpenses()
  }
  
  listExpenses(): void {
    this.monthlyExpenseService.list({ month: this.month.id }).subscribe(({ data }) => this.expenses = data)
  }
  
  addExpense(): void {
    const { componentInstance, result } = this.modalService.open(AddEditMonthlyExpenseComponent, { size: 'md' })
    
    componentInstance.month = this.month
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Criado com sucesso!')
        
        this.listExpenses()
      }
    })
  }
  
  editExpense(expense: MonthlyExpenseDTO): void {
    const { componentInstance, result } = this.modalService.open(AddEditMonthlyExpenseComponent, { size: 'lg' })
    
    componentInstance.expense = expense
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Editado com sucesso!')
        
        this.listExpenses()
      }
    })
  }
  
  deleteExpense({ month, value, description, id }: MonthlyExpenseDTO): void {
    const { componentInstance, result } = this.modalService.open(GeneralWarningComponent, { size: 'md' })
    let monthName: string
    
    for(const m in monthNames) if(monthNames[m] == `${month.month}`) monthName = m
    
    componentInstance.title = 'Excluir gasto fixo'
    componentInstance.text = `
      Deseja realmente excluir esta mensalidade de ${monthName}? <br><br> <b>R$${value.toString()} - ${description}</b>`
    
    result.then((res: boolean) => res && 
      this.monthlyExpenseService.delete(id).subscribe(() => {
        this.toastr.success('Excluído com sucesso!')
        
        this.listExpenses()
      })
    )
  }
}
