import { Component, OnInit, Input } from '@angular/core';
import MonthDTO from 'src/app/shared/DTOs/month';
import YearDTO from 'src/app/shared/DTOs/year';
import { MonthService } from 'src/app/shared/services/month/month.service';
import { YearService } from 'src/app/shared/services/year/year.service';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';
import { forkJoin, map, Observable, BehaviorSubject, Subject, skip, tap, switchMap } from 'rxjs';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { TagService } from 'src/app/shared/services/tag/tag.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import CategoryRemaining from 'src/app/shared/interfaces/CategoryRemaining';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  @Input() set update(signal: number) {
    if(signal) this.calculateAnalytics()
  }
  dropdown: '' | 'year' | 'month' = ''
  years$ = new BehaviorSubject<YearDTO[]>(undefined)
  year$ = new Subject<YearDTO>()
  months$ = new BehaviorSubject<MonthDTO[]>(undefined)
  month$ = new BehaviorSubject<MonthDTO>(undefined)
  actualBalance$ = new Subject<number | '--'>()
  recentExpenses$ = new Subject<number | '--'>()
  yearExpenses$ = new Subject<number | '--'>()
  mostExpensiveCategory: { name: string, total: number } | '--' = '--'
  mostExpensiveTag: { name: string, total: number } | '--' = '--'
  categoriesRemaining: CategoryRemaining[] = []
  
  constructor(
    private yearService: YearService,
    private monthService: MonthService,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private analyticsService: AnalyticsService
  ) { }
  
  ngOnInit(): void {
    this.handleYears()
    this.handleMonths()
    
    this.yearService.list().pipe(
      map(({ data }) => data)
    ).subscribe(this.years$)
  }
  
  handleYears(): void {
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
  }
  
  handleMonths(): void {
    this.months$.pipe(
      skip(1), 
      map(months => months[0])
    ).subscribe(this.month$)
    
    this.month$.pipe(
      skip(1),
      tap(() => this.calculateAnalytics())
    ).subscribe()
  }
  
  // TODO: transfer methods' logic to backend analytics service - too complex for frontend to handle
  calculateAnalytics(): void {
    this.calculateActualBalance(this.month$.getValue())
    this.calculateRecentExpenses(this.month$.getValue())
    this.calculateYearExpenses(this.month$.getValue())
    this.getMostExpensiveCategory(this.month$.getValue()) // TODO
    this.getMostExpensiveTag(this.month$.getValue()) // TODO
    this.listCategoriesRemaining(this.month$.getValue())
  }
  
  calculateActualBalance({ id }: MonthDTO): void {
    this.analyticsService.monthBalance(id).subscribe(({ data }) => this.actualBalance$.next(data.balance || '--'))
  }
  
  calculateRecentExpenses({ id }: MonthDTO): void {
    this.analyticsService.recentExpenses(id).subscribe(({ data }) => this.recentExpenses$.next(data))
  }
  
  calculateYearExpenses({ month, id }: MonthDTO): void {
    if(month == 1) {
      this.yearExpenses$.next('--')
    }
    else {
      this.analyticsService.yearExpenses(id).subscribe(({ data }) => this.yearExpenses$.next(data))
    }
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
  
  getMostExpensiveTag(actualMonth: MonthDTO): void {
    this.mostExpensiveTag = '--'
    
    // const groups$ = this.groupService.list({ month: actualMonth.id }).pipe(map(({ data }) => data))
    // const forkJoinObj: { [group: string]: Observable<number> } = {}
    // let allGroupsExpenses$: Observable<{ [group: string]: number }>
    
    // groups$.subscribe(groups => {
    //   if(!groups.length) {
    //     this.mostExpensiveGroup = '--'
        
    //     return
    //   }
      
    //   groups.forEach(({ id, name }) => {
    //     forkJoinObj[name] = this.expenseService.list({ group: id }).pipe(map(res => res.data.reduce((prev, curr) => prev += curr.value, 0)))
    //   })
      
    //   allGroupsExpenses$ = forkJoin(forkJoinObj)
      
    //   allGroupsExpenses$.subscribe(res => {
    //     let max = { name: '--', total: 0 }
        
    //     Object.entries(res).forEach(([ name, total ]) => {
    //       if(total > max.total) max = { name, total }
    //     })
        
    //     this.mostExpensiveGroup = max
    //   })
    // })
  }
  
  listCategoriesRemaining({ id }: MonthDTO): void {
    this.categoryService.list({ month: id }).subscribe(({ data }) => {
      if(!data.length) this.categoriesRemaining = []
      else {
        const categoriesRemaining$ = data.map(({ id }) => this.analyticsService.categoryRemaining(id).pipe(
            map(({ data }) => data)
          ))
          
        forkJoin(categoriesRemaining$).subscribe(categoriesRemainings => this.categoriesRemaining = categoriesRemainings)
      }
    })
  }
}
