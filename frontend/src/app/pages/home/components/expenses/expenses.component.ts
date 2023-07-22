import { AfterViewInit, Component, OnInit, Output } from '@angular/core';
import YearDTO from 'src/app/shared/DTOs/year';
import { YearService } from 'src/app/shared/services/year/year.service';
import ExpensesFilters from 'src/app/shared/interfaces/ExpensesFilters';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';
import ExpenseDTO from 'src/app/shared/DTOs/expense';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralWarningComponent } from 'src/app/shared/components/modals/general-warning/general-warning.component';
import { ToastrService } from 'ngx-toastr';
import { AddEditExpenseComponent } from 'src/app/pages/home/components/expenses/components/add-edit-expense/add-edit-expense.component';
import { map, tap, BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { catchError, concatMap, debounceTime, distinctUntilChanged, filter, skip, switchMap } from 'rxjs/operators';
import { SortEvent } from 'src/app/shared/interfaces/SortEvent';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit, AfterViewInit {
  @Output() expensesUpdated = new Subject<void>()
  activeYear!: YearDTO['id']
  years: YearDTO[] = []
  expenses: ExpenseDTO[] = []
  loading = false
  initSortDirective = false
  filters = new BehaviorSubject<ExpensesFilters>(undefined)
  search = new BehaviorSubject<ExpenseDTO['description']>('')
  orderBy = new BehaviorSubject<['date' | 'value', 'ASC' | 'DESC'] | []>([])
  scrolled = new Subject<void>()
  page = 0
  keepListing = true
  
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

    this.orderBy.pipe(
      skip(1),
      tap(() => {
        this.keepListing = true
        this.page = 0
        this.expenses = []
      }),
      switchMap(() => this.listExpenses())
    ).subscribe()

    this.search.pipe(
      skip(1),
      filter(text => !text.length || text.length >= 3),
      debounceTime(1000),
      distinctUntilChanged(),
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

  ngAfterViewInit(): void {
    this.initSortDirective = true
  }

  sortTable({ column, order }: SortEvent<'date' | 'value'>): void {
    if(order) this.orderBy.next([column, order])
    else this.orderBy.next([])
  }
  
  listExpenses(): Observable<ExpenseDTO[]> {    
    const { months, categories, tags } = this.filters.value
    let queryValue: number | number[] = this.activeYear
    let queryKey: 'year' | 'months' | 'categories' = 'year'
    
    if(categories.length) {
      queryValue = categories.map(({ id }) => id)
      queryKey = 'categories'
    }
    else if(months.length) {
      queryValue = months.map(({ id }) => id)
      queryKey = 'months'
    }
    
    this.loading = true

    return this.expensesService.list({ 
        [queryKey]: queryValue, 
        tags: tags.map(({ id }) => id),
        description: this.search.value,
        orderBy: this.orderBy.value,
        page: this.page,
      }).pipe(
        catchError(() => of({ data: [] })),
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
