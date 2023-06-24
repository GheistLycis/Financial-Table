import { Component, OnInit } from '@angular/core';
import MonthDTO from 'src/app/DTOs/month';
import YearDTO from 'src/app/DTOs/year';
import { MonthService } from 'src/app/services/month/month.service';
import { YearService } from 'src/app/services/year/year.service';
import { Subject, BehaviorSubject, forkJoin, map, firstValueFrom } from 'rxjs';
import { ExpenseService } from 'src/app/services/expense/expense.service';

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
  
  constructor(
    private yearService: YearService,
    private monthService: MonthService,
    private expenseService: ExpenseService,
  ) {
    this.year$.subscribe(value => this.monthService.list({ year: value.id }).subscribe(({ data }) => this.months$.next(data)))
    
    this.months$.subscribe(value => this.month$.next(value[0]))
    
    this.month$.subscribe(() => this.calculateAnalytics())
  }
  
  ngOnInit(): void {
    this.yearService.list().subscribe(({ data }) => {
      this.years = data
      
      this.year$.next(this.years[0])
    })
  }
  
  calculateAnalytics(): void {
    this.calculateRecentExpenses()
  }
  
  async calculateRecentExpenses(): Promise<void> {
    const actualMonth = this.month$.getValue()
    let previousMonth: MonthDTO
    
    if(actualMonth.month == 1) {
      const previousYear = this.years.find(({ year }) => year == actualMonth.year.year-1)
      
      previousMonth = await firstValueFrom(this.monthService.list({ year: previousYear.id })).then(({ data }) => data[0])
    }
    else {
      previousMonth = this.months$.getValue().find(({ month, year }) => (month == actualMonth.month-1) && (year.year == actualMonth.year.year))
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
}
