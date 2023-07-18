import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import YearDTO from 'src/app/shared/DTOs/year';
import MonthHistory from 'src/app/shared/interfaces/MonthHistory';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { MonthService } from 'src/app/shared/services/month/month.service';
import { YearService } from 'src/app/shared/services/year/year.service';
import { AddEditMonthComponent } from './components/add-edit-month/add-edit-month.component';
import MonthDTO from 'src/app/shared/DTOs/month';
import { GeneralWarningComponent } from 'src/app/shared/components/modals/general-warning/general-warning.component';
import { BehaviorSubject, skip, tap, forkJoin, map } from 'rxjs';
import { MonthlyIncomesComponent } from './components/monthly-incomes/monthly-incomes.component';
import { MonthlyExpensesComponent } from './components/monthly-expenses/monthly-expenses.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { DuplicateMonthComponent } from './components/duplicate-month/duplicate-month.component';
import { MonthNamePipe } from 'src/app/shared/pipes/month-name/month-name.pipe';

@Component({
  selector: 'app-months',
  templateUrl: './months.component.html',
  styleUrls: ['./months.component.scss'],
  providers: [MonthNamePipe],
})
export class MonthsComponent {
  years: YearDTO[] = []
  activeYear$ = new BehaviorSubject<YearDTO['id']>(undefined)
  monthsHistories: MonthHistory[] = []
  loading = false
  
  constructor(
    private yearService: YearService,
    private monthService: MonthService,
    private analyticsService: AnalyticsService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private monthNamePipe: MonthNamePipe,
  ) { 
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
    
    this.monthService.list({ year: this.activeYear$.getValue() }).subscribe(({ data }) => {
      if(!data.length) this.monthsHistories = []
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
    const { componentInstance, result } = this.modalService.open(DuplicateMonthComponent, { size: 'md' })
    
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
