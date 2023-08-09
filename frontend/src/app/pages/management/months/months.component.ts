import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import YearDTO from '@DTOs/year';
import MonthHistory from '@interfaces/MonthHistory';
import { AnalyticsService } from '@services/analytics/analytics.service';
import { MonthService } from '@services/month/month.service';
import { YearService } from '@services/year/year.service';
import { AddEditMonthComponent } from './components/add-edit-month/add-edit-month.component';
import MonthDTO from '@DTOs/month';
import { GeneralWarningComponent } from '@components/modals/general-warning/general-warning.component';
import { BehaviorSubject, skip, tap, forkJoin, map, Subject, filter, switchMap, catchError, of } from 'rxjs';
import { MonthlyIncomesComponent } from './components/monthly-incomes/monthly-incomes.component';
import { MonthlyExpensesComponent } from './components/monthly-expenses/monthly-expenses.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { DuplicateMonthComponent } from './components/duplicate-month/duplicate-month.component';
import { MonthNamePipe } from '@pipes/month-name/month-name.pipe';

@Component({
  selector: 'app-months',
  templateUrl: './months.component.html',
  styleUrls: ['./months.component.scss'],
  providers: [MonthNamePipe],
})
export class MonthsComponent {
  years: YearDTO[] = []
  downloadCSV$ = new Subject<void>()
  activeYear$ = new BehaviorSubject<YearDTO['id']>(undefined)
  monthsHistories: MonthHistory[] = []
  loading = false
  loadingCSV = false
  
  constructor(
    private yearService: YearService,
    private monthService: MonthService,
    private analyticsService: AnalyticsService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private monthNamePipe: MonthNamePipe,
  ) { 
    this.downloadCSV$.pipe(
      filter(() => !this.loadingCSV),
      tap(() => this.loadingCSV = true),
      switchMap(() => this.monthService.getCSV()),
      map(({ data }) => data),
      tap(csv => {
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')

        a.download = 'Histórico de Meses ' + new Date().toISOString().split('T')[0] + '.csv'
        a.href = url
        a.click()
      }),
      catchError(() => of()),
      tap(() => this.loadingCSV = false),
    ).subscribe()

    this.activeYear$.pipe(
      skip(1),
      tap(() => this.listHistories())
    ).subscribe()
  }
  
  ngOnInit(): void {
    this.listYears()
  }
  
  listYears(): void {
    this.loading = true
    this.yearService.list().pipe(
      tap(({ data }) => {
        this.loading = false
        this.years = data
        if(this.years.length) this.activeYear$.next(this.years[0].id)
      })
    ).subscribe()
  }
  
  listHistories(): void {
    this.loading = true
    
    this.monthService.list({ year: this.activeYear$.value }).subscribe(({ data }) => {
      if(!data.length) {
        this.monthsHistories = []
        this.loading = false
      }
      else {
        const histories$ = data.map(({ id }) => this.analyticsService.monthHistory(id).pipe(
            map(({ data }) => data)
          ))
        
        forkJoin(histories$).subscribe({
          next: partialHistories => {
            const balances$ = partialHistories.map(({ month }) => this.analyticsService.monthBalance(month.id).pipe(
                map(({ data }) => data)
              ))
              
            forkJoin(balances$).subscribe({
              next: balances => {
                const histories: MonthHistory[] = balances.map((balance, i) => {
                  const partialHistory: any = partialHistories[i]
                  
                  partialHistory.balance = balance.balance
                  
                  return partialHistory
                })
                
                this.monthsHistories = histories
                this.loading = false
              },
              error: () => this.loading = false
            })
          },
          error: () => this.loading = false
        })
      }
    })
  }
  
  addMonth(): void {
    const { result } = this.modalService.open(AddEditMonthComponent, { size: 'lg' })
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Criado com sucesso!')
        
        this.listHistories()
      }
    })
  }
  
  duplicateMonth(month: MonthDTO): void {
    const { componentInstance, result } = this.modalService.open(DuplicateMonthComponent, { size: 'sm' })
    
    componentInstance.month = month
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Duplicado com sucesso!')
        
        this.listHistories()
      }
    })
  }
  
  editMonth(month: MonthDTO): void {
    const { componentInstance, result } = this.modalService.open(AddEditMonthComponent, { size: 'lg' })
    
    componentInstance.month = month
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Editado com sucesso!')
        
        this.listHistories()
      }
    })
  }
  
  deleteMonth({ id, month, year }: MonthDTO): void {
    const { componentInstance, result } = this.modalService.open(GeneralWarningComponent, { size: 'md' })
    
    componentInstance.title = 'Excluir mês'
    componentInstance.text = `
      Deseja realmente excluir o mês de ${this.monthNamePipe.transform(month)} de ${year.year}? 
      <b>Tudo</b> que está registrado nele - registros, grupos e categorias - será <b>perdido!</b>`
    
    result.then((res: boolean) => res && 
      this.monthService.delete(id).subscribe(() => {
        this.toastr.success('Excluído com sucesso!')
        
        this.listYears()
        this.listHistories()
      })
    )
  }
  
  listMonthlyIncomes(month: MonthDTO): void {
    const { componentInstance, result } = this.modalService.open(MonthlyIncomesComponent, { size: 'xl' })
    
    componentInstance.month = month
    
    result.then(() => this.listHistories(), () => this.listHistories())
  }
  
  listMonthlyExpenses(month: MonthDTO): void {
    const { componentInstance, result } = this.modalService.open(MonthlyExpensesComponent, { size: 'xl' })
    
    componentInstance.month = month
    
    result.then(() => this.listHistories(), () => this.listHistories())
  }
  
  listCategories(month: MonthDTO): void {
    this.modalService.open(CategoriesComponent, { size: 'xl' }).componentInstance.month = month
  }
}
