import { Component, OnInit } from '@angular/core';
import MonthDTO from 'src/app/DTOs/month';
import YearDTO from 'src/app/DTOs/year';
import { MonthService } from 'src/app/services/month/month.service';
import { YearService } from 'src/app/services/year/year.service';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { Subject, forkJoin, map, firstValueFrom, Observable, BehaviorSubject, skip } from 'rxjs';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  dropdown: '' | 'year' | 'month' = ''
  years: YearDTO[] = []
  year$ = new Subject<YearDTO>()
  months$ = new BehaviorSubject<MonthDTO[]>(null)
  month$ = new BehaviorSubject<MonthDTO>(null)
  recentExpenses: number | '--' = '--'
  yearExpenses: number | '--' = '--'
  
  constructor(
    private yearService: YearService,
    private monthService: MonthService,
    private expenseService: ExpenseService,
  ) {
    this.year$.subscribe(value => this.monthService.list({ year: value.id }).subscribe(({ data }) => this.months$.next(data)))
    
    this.months$.pipe(skip(1)).subscribe(value => this.month$.next(value[0]))
    
    this.month$.pipe(skip(1)).subscribe(() => this.calculateAnalytics())
  }
  
  ngOnInit(): void {
    this.yearService.list().subscribe(({ data }) => {
      this.years = data
      
      this.year$.next(this.years[0])
    })
  }
  
  // TO-DO: transfer methods' logic to backend analytics service - too complex for frontend to handle
  calculateAnalytics(): void {
    this.calculateRecentExpenses(this.month$.getValue(), this.months$.getValue())
    this.calculateYearExpenses(this.month$.getValue(), this.months$.getValue())
  }
  
  async calculateRecentExpenses(actualMonth: MonthDTO, monthsList: MonthDTO[]): Promise<void> {
    let previousMonth: MonthDTO
    
    if(actualMonth.month == 1) {
      const previousYear = this.years.find(({ year }) => year == actualMonth.year.year-1)
      
      previousMonth = await firstValueFrom(this.monthService.list({ year: previousYear.id })).then(({ data }) => data[0])
    }
    else {
      previousMonth = monthsList.find(({ month, year }) => (month == actualMonth.month-1) && (year.year == actualMonth.year.year))
    }

    const lastMonthsExpenses$ = forkJoin({
      actualMonth: this.expenseService.list({ month: actualMonth.id }).pipe(map(res => res.data.reduce((prev, curr) => prev += curr.value, 0))),
      previousMonth: this.expenseService.list({ month: previousMonth.id }).pipe(map(res => res.data.reduce((prev, curr) => prev += curr.value, 0))),
    })
    
    lastMonthsExpenses$.subscribe(({ actualMonth, previousMonth }) => {
      this.recentExpenses = actualMonth && previousMonth 
        ? ((100 * actualMonth / previousMonth) -100)
        : '--'
    })
  }
  
  calculateYearExpenses(actualMonth: MonthDTO, monthsList: MonthDTO[]): void {
    if(actualMonth.month == 1) {
      this.yearExpenses == '--'

      return
    }
    
    const forkJoinObj: { [month: string]: Observable<number> } = {
      actualMonth: this.expenseService.list({ month: actualMonth.id }).pipe(map(res => res.data.reduce((prev, curr) => prev += curr.value, 0))),
    }
    const previousMonths = monthsList.filter(({ month }) => month < actualMonth.month)
    
    previousMonths.forEach(({ month, id }) => {
      forkJoinObj[month] = this.expenseService.list({ month: id }).pipe(map(res => res.data.reduce((prev, curr) => prev += curr.value, 0)))
    })
    
    const yearExpenses$ = forkJoin(forkJoinObj)
    
    yearExpenses$.subscribe(res => {
      const actualMonthExpenses = res['actualMonth']
      let previousMonthsExpenses = 0 
      
      for(const month in res) {
        if(month != 'actualMonth') previousMonthsExpenses += res[month]
      }
      
      previousMonthsExpenses = previousMonthsExpenses / previousMonths.length
      
      this.yearExpenses = actualMonthExpenses && previousMonthsExpenses 
        ? ((100 * actualMonthExpenses / previousMonthsExpenses) -100)
        : '--'
    })
  }
}
