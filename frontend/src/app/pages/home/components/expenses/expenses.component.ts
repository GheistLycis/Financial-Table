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
import { map, tap, forkJoin, BehaviorSubject, Subject, of, Observable } from 'rxjs';
import { concatMap, debounceTime, filter, skip, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  @Output() expensesUpdated = new Subject<void>()
  activeYear!: YearDTO['id']
  years: YearDTO[] = []
  expenses: ExpenseDTO[] = []
  filters = new BehaviorSubject<Filters>(undefined)
  page = 0
  scrolled = new Subject<void>()
  keepListing = true
  loading = false
  
  constructor(
    private yearService: YearService,
    private expensesService: ExpenseService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) {
    this.filters.pipe(
      skip(1),
      tap(() => {
        this.keepListing = true
        this.page = 0
        this.expenses = []
      }),
      switchMap(() => this.listExpenses())
    ).subscribe()

    this.scrolled.pipe(
      debounceTime(100),
      filter(() => this.keepListing),
      concatMap(() => this.listExpenses()),
    ).subscribe()

    this.expensesUpdated.pipe(
      switchMap(() => this.listExpenses())
    ).subscribe()
  }
  
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
  
  listExpenses(): Observable<ExpenseDTO[]> {    
    const { months, categories, tags } = this.filters.value
    let reqFilters: MonthDTO[] | CategoryDTO[]
    let key: 'month' | 'category'
    
    if(categories.length) {
      reqFilters = categories
      key = 'category'
    }
    else if(months.length) {
      reqFilters = months
      key = 'month'
    }
    
    this.loading = true

    if(key) {
      const forkJoinArr = reqFilters.map(({ id }) => this.expensesService.list({ [key]: id, tags: tags.map(({ id }) => id), page: this.page }).pipe(
        map(({ data }) => data)
      ))
      
      return forkJoin(forkJoinArr).pipe(
        map(filtersExpenses => filtersExpenses.flat()),
        tap(expenses => {
          this.loading = false

          if(expenses.length) {
            this.expenses = this.expenses.concat(expenses)
            this.page++
          }
          else this.keepListing = false
        })
      )
    }
    else {
      return this.expensesService.list({ year: this.activeYear, page: this.page }).pipe(
        map(({ data }) => data),
        tap(expenses => {
          this.loading = false

          if(expenses.length) {
            this.expenses = this.expenses.concat(expenses)
            this.page++
          }
          else this.keepListing = false
        })
      )
    }
  }
  
  addExpense(): void {
    const { componentInstance, result } = this.modalService.open(AddEditExpenseComponent, { size: 'lg' })
    
    componentInstance.year = this.activeYear
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Criado com sucesso!')
        
        this.expensesUpdated.next()
      }
    })
  }
  
  editExpense(expense: ExpenseDTO): void {
    const { componentInstance, result } = this.modalService.open(AddEditExpenseComponent, { size: 'lg' })
    
    componentInstance.expense = expense
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Editado com sucesso!')
        
        this.expensesUpdated.next()
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
        
        this.expensesUpdated.next()
      })
    )
  }
}
