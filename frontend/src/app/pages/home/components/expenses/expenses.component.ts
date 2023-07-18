import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import YearDTO from 'src/app/shared/DTOs/year';
import { YearService } from 'src/app/shared/services/year/year.service';
import Filters from 'src/app/shared/interfaces/Filters';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';
import MonthDTO from 'src/app/shared/DTOs/month';
import CategoryDTO from 'src/app/shared/DTOs/category';
import ExpenseDTO from 'src/app/shared/DTOs/expense';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralWarningComponent } from 'src/app/shared/components/modals/general-warning/general-warning.component';
import { ToastrService } from 'ngx-toastr';
import { AddEditExpenseComponent } from 'src/app/pages/home/components/expenses/components/add-edit-expense/add-edit-expense.component';
import { map, tap, forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  loading = false
  @Output() expensesUpdated = new EventEmitter<void>()
  activeYear!: YearDTO['id']
  years: YearDTO[] = []
  expenses: ExpenseDTO[] = []
  filters!: Filters
  
  constructor(
    private yearService: YearService,
    private expensesService: ExpenseService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) { }
  
  ngOnInit(): void {
    this.yearService.list().pipe(
      map(({ data }) => data),
      filter(data => data.length != 0),
      tap(years => {
        this.years = years
        
        this.activeYear = years[0].id
      })
    ).subscribe()
  }
  
  listExpenses(filter: Filters): void {
    const { months, categories, tags } = filter
    let filters: MonthDTO[] | CategoryDTO[]
    let key: 'month' | 'category'
    
    this.filters = filter
    
    if(categories.length) {
      filters = categories
      key = 'category'
    }
    else if(months.length) {
      filters = months
      key = 'month'
    }
    
    this.loading = true
    
    if(key) {
      const forkJoinArr = filters.map(({ id }) => this.expensesService.list({ [key]: id, tags: tags.map(({ id }) => id) }).pipe(
        map(({ data }) => data)
      ))
      
      forkJoin(forkJoinArr).pipe(
        map(filtersExpenses => filtersExpenses.flat()),
        tap(expenses => this.expenses = expenses)
      ).subscribe({ 
        next: () => this.loading = false, 
        error: () => this.loading = false, 
        complete: () => this.loading = false 
      })
    }
    else {
      this.expensesService.list({ year: this.activeYear }).pipe(
        map(({ data }) => data),
        tap(expenses => this.expenses = expenses)
      ).subscribe({ 
        next: () => this.loading = false, 
        error: () => this.loading = false, 
        complete: () => this.loading = false 
      })
    }
  }
  
  addExpense(): void {
    const { componentInstance, result } = this.modalService.open(AddEditExpenseComponent, { size: 'lg' })
    
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
    const { componentInstance, result } = this.modalService.open(AddEditExpenseComponent, { size: 'lg' })
    
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
