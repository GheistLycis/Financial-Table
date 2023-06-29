import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { map, tap, forkJoin } from 'rxjs';
import YearDTO from 'src/app/shared/DTOs/year';
import { YearService } from 'src/app/shared/services/year/year.service';
import Filters from 'src/app/shared/interfaces/Filters';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';
import MonthDTO from 'src/app/shared/DTOs/month';
import CategoryDTO from 'src/app/shared/DTOs/category';
import GroupDTO from 'src/app/shared/DTOs/group';
import ExpenseDTO from 'src/app/shared/DTOs/expense';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralWarningComponent } from 'src/app/shared/components/modals/general-warning/general-warning.component';
import { ToastrService } from 'ngx-toastr';
import { AddEditExpenseComponent } from 'src/app/pages/home/components/expenses-table/components/add-edit-expense/add-edit-expense.component';

@Component({
  selector: 'app-expenses-table',
  templateUrl: './expenses-table.component.html',
  styleUrls: ['./expenses-table.component.scss']
})
export class ExpensesTableComponent implements OnInit {
  @Output() expensesUpdated = new EventEmitter<void>()
  activeYear!: YearDTO['id']
  years: YearDTO[] = []
  expenses: ExpenseDTO[] = []
  filters!: Filters
  loading = false
  
  constructor(
    private yearService: YearService,
    private expensesService: ExpenseService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) { }
  
  ngOnInit(): void {
    this.yearService.list().pipe(
      map(({ data }) => data),
      tap(years => {
        this.years = years
        
        this.activeYear = years[0].id
      })
    ).subscribe()
  }
  
  listExpenses(filter: Filters): void {
    const { months, categories, groups } = filter
    let filters: MonthDTO[] | CategoryDTO[] | GroupDTO[]
    let key: 'month' | 'category' | 'group'
    
    this.filters = filter
    
    if(groups.length) {
      filters = groups
      key = 'group'
    }
    else if(categories.length) {
      filters = categories
      key = 'category'
    }
    else if(months.length) {
      filters = months
      key = 'month'
    }
    
    if(key) {
      const forkJoinArr = filters.map(({ id }) => this.expensesService.list({ [key]: id }).pipe(
        map(({ data }) => data)
      ))
      
      forkJoin(forkJoinArr).pipe(
        map(filtersExpenses => filtersExpenses.flat()),
        tap(expenses => this.expenses = expenses)
      ).subscribe({ 
        error: () => this.loading = false, 
        complete: () => this.loading = false 
      })
    }
    else {
      this.expensesService.list({ year: this.activeYear }).pipe(
        map(({ data }) => data),
        tap(expenses => this.expenses = expenses)
      ).subscribe({ 
        error: () => this.loading = false, 
        complete: () => this.loading = false 
      })
    }
  }
  
  addExpense(): void {
    const { componentInstance, result } = this.modalService.open(AddEditExpenseComponent, { size: 'xl' })
    
    componentInstance.year = this.activeYear
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Criado com sucesso!')
        
        this.expensesUpdated.emit()
        
        this.listExpenses(this.filters)
      }
    })
  }
  
  editExpense(expense: ExpenseDTO): void {
    const { componentInstance, result } = this.modalService.open(AddEditExpenseComponent, { size: 'xl' })
    
    componentInstance.expense = expense
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Editado com sucesso!')
        
        this.expensesUpdated.emit()
        
        this.listExpenses(this.filters)
      }
    })
  }
  
  deleteExpense({ id, value, description }: ExpenseDTO) {
    const { componentInstance, result } = this.modalService.open(GeneralWarningComponent, { size: 'md' })
    
    componentInstance.title = 'Excluir registro'
    componentInstance.text = `Deseja realmente excluir este registro de gasto? <br><br> <b>R$${value.toString()} - ${description}</b>`
    
    result.then((res: boolean) => res && 
      this.expensesService.delete(id).subscribe(() => {
        this.toastr.success('Excluído com sucesso!')
        
        this.expensesUpdated.emit()
        
        this.listExpenses(this.filters)
      })
    )
  }
}
