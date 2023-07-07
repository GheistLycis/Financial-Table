import { Component, OnInit, Input } from '@angular/core';
import MonthDTO from 'src/app/shared/DTOs/month';
import YearDTO from 'src/app/shared/DTOs/year';
import { MonthService } from 'src/app/shared/services/month/month.service';
import { YearService } from 'src/app/shared/services/year/year.service';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';
import { forkJoin, map, BehaviorSubject, Subject, skip, tap, switchMap } from 'rxjs';
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
  mostExpensiveCategory$ = new Subject<{ name: string, total: number }>()
  mostExpensiveTags$ = new Subject<{ name: string, total: number }>()
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
  
  calculateAnalytics(): void {
    this.calculateActualBalance(this.month$.getValue())
    this.calculateRecentExpenses(this.month$.getValue())
    this.calculateYearExpenses(this.month$.getValue())
    this.getMostExpensiveCategory(this.month$.getValue())
    this.getMostExpensiveTags(this.month$.getValue())
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
  
  getMostExpensiveCategory({ id }: MonthDTO): void {
    this.analyticsService.mostExpensiveCategory(id).subscribe(({ data }) => this.mostExpensiveCategory$.next(data))
  }
  
  getMostExpensiveTags({ id }: MonthDTO): void {
    this.analyticsService.mostExpensiveTags(id).subscribe(({ data }) => this.mostExpensiveTags$.next(data))
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
