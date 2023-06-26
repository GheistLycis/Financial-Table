import { Component, OnInit } from '@angular/core';
import MonthDTO from 'src/app/DTOs/month';
import YearDTO from 'src/app/DTOs/year';
import { MonthService } from 'src/app/services/month/month.service';
import { YearService } from 'src/app/services/year/year.service';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { forkJoin, map, firstValueFrom, Observable, BehaviorSubject, Subject, skip, tap, switchMap } from 'rxjs';
import { CategoryService } from 'src/app/services/category/category.service';
import { GroupService } from 'src/app/services/group/group.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  dropdown: '' | 'year' | 'month' = ''
  years$ = new BehaviorSubject<YearDTO[]>(undefined)
  year$ = new Subject<YearDTO>()
  months$ = new BehaviorSubject<MonthDTO[]>(undefined)
  month$ = new BehaviorSubject<MonthDTO>(undefined)
  recentExpenses: number | '--' = '--'
  yearExpenses: number | '--' = '--'
  mostExpensiveCategory: { name: string, total: number } | '--' = '--'
  mostExpensiveGroup: { name: string, total: number } | '--' = '--'
  
  constructor(
    private yearService: YearService,
    private monthService: MonthService,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private groupService: GroupService,
  ) {
    this.years$.pipe(
      skip(1), 
      tap(years => this.year$.next(years[0]))
    ).subscribe()
    
    this.year$.pipe(
      switchMap(({ id }) => this.monthService.list({ year: id }).pipe(
          map(({ data }) => data)
        )
      )
    ).subscribe(this.months$)
    
    this.months$.pipe(
      skip(1), 
      map(months => months[0])
    ).subscribe(this.month$)
    
    this.month$.pipe(
      skip(1),
      tap(() => this.calculateAnalytics())
    ).subscribe()
  }
  
  ngOnInit(): void {
    this.yearService.list().pipe(
      map(({ data }) => data)
    ).subscribe(this.years$)
  }
  
  // TO-DO: transfer methods' logic to backend analytics service - too complex for frontend to handle
  calculateAnalytics(): void {
    this.calculateRecentExpenses(this.month$.getValue(), this.months$.getValue())
    this.calculateYearExpenses(this.month$.getValue(), this.months$.getValue())
    this.getMostExpensiveCategory(this.month$.getValue())
    this.getMostExpensiveGroup(this.month$.getValue())
  }
  
  async calculateRecentExpenses(actualMonth: MonthDTO, monthsList: MonthDTO[]): Promise<void> {
    let previousMonth: MonthDTO
    
    if(actualMonth.month == 1) {
      const previousYear = this.years$.getValue().find(({ year }) => year == actualMonth.year.year-1)
      
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
  
  getMostExpensiveCategory(actualMonth: MonthDTO): void {
    const categories$ = this.categoryService.list({ month: actualMonth.id }).pipe(map(({ data }) => data))
    const forkJoinObj: { [category: string]: Observable<number> } = {}
    let allCategoriesExpenses$: Observable<{ [category: string]: number }>
    
    categories$.subscribe(categories => {
      if(!categories.length) {
        this.mostExpensiveCategory = '--'
        
        return
      }
      
      categories.forEach(({ id, name }) => {
        forkJoinObj[name] = this.expenseService.list({ category: id }).pipe(map(res => res.data.reduce((prev, curr) => prev += curr.value, 0)))
      })
      
      allCategoriesExpenses$ = forkJoin(forkJoinObj)
      
      allCategoriesExpenses$.subscribe(res => {
        let max = { name: '--', total: 0 }
        
        Object.entries(res).forEach(([ name, total ]) => {
          if(total > max.total) max = { name, total }
        })
        
        this.mostExpensiveCategory = max
      })
    })
  }
  
  getMostExpensiveGroup(actualMonth: MonthDTO): void {
    const groups$ = this.groupService.list({ month: actualMonth.id }).pipe(map(({ data }) => data))
    const forkJoinObj: { [group: string]: Observable<number> } = {}
    let allGroupsExpenses$: Observable<{ [group: string]: number }>
    
    groups$.subscribe(groups => {
      if(!groups.length) {
        this.mostExpensiveGroup = '--'
        
        return
      }
      
      groups.forEach(({ id, name }) => {
        forkJoinObj[name] = this.expenseService.list({ group: id }).pipe(map(res => res.data.reduce((prev, curr) => prev += curr.value, 0)))
      })
      
      allGroupsExpenses$ = forkJoin(forkJoinObj)
      
      allGroupsExpenses$.subscribe(res => {
        let max = { name: '--', total: 0 }
        
        Object.entries(res).forEach(([ name, total ]) => {
          if(total > max.total) max = { name, total }
        })
        
        this.mostExpensiveGroup = max
      })
    })
  }
}
