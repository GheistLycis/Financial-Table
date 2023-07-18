import { Component, OnInit, Input } from '@angular/core';
import MonthDTO from 'src/app/shared/DTOs/month';
import YearDTO from 'src/app/shared/DTOs/year';
import { MonthService } from 'src/app/shared/services/month/month.service';
import { YearService } from 'src/app/shared/services/year/year.service';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import CategoryRemaining from 'src/app/shared/interfaces/CategoryRemaining';
import { forkJoin, map, BehaviorSubject, Subject, skip, tap, switchMap } from 'rxjs';
import { filter } from 'rxjs/operators';

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
  loading = false
  
  constructor(
    private yearService: YearService,
    private monthService: MonthService,
    private categoryService: CategoryService,
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
      filter(data => data.length != 0),
      tap(years => {
        this.year$.next(years[0])
        
        this.loading = true
      }),
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
      tap(() => {
        this.loading = false
        
        this.calculateAnalytics()
      }),
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
    this.loading = true
    this.analyticsService.monthBalance(id).pipe(
      tap(() => this.loading = false),
    ).subscribe(({ data }) => this.actualBalance$.next(data.balance || '--'))
  }
  
  calculateRecentExpenses({ id }: MonthDTO): void {
    this.loading = true
    this.analyticsService.recentExpenses(id).pipe(
      tap(() => this.loading = false),
    ).subscribe(({ data }) => this.recentExpenses$.next(data))
  }
  
  calculateYearExpenses({ month, id }: MonthDTO): void {
    if(month == 1) {
      this.yearExpenses$.next('--')
    }
    else {
      this.loading = true
      this.analyticsService.yearExpenses(id).pipe(
        tap(() => this.loading = false),
      ).subscribe(({ data }) => this.yearExpenses$.next(data))
    }
  }
  
  getMostExpensiveCategory({ id }: MonthDTO): void {
    this.loading = true
    this.analyticsService.mostExpensiveCategory(id).pipe(
      tap(() => this.loading = false),
    ).subscribe(({ data }) => this.mostExpensiveCategory$.next(data))
  }
  
  getMostExpensiveTags({ id }: MonthDTO): void {
    this.loading = true
    this.analyticsService.mostExpensiveTags(id).pipe(
      tap(() => this.loading = false),
    ).subscribe(({ data }) => this.mostExpensiveTags$.next(data))
  }
  
  listCategoriesRemaining({ id }: MonthDTO): void {
    this.loading = true
    this.categoryService.list({ month: id }).subscribe(({ data }) => {
      if(!data.length) {
        this.categoriesRemaining = []
        this.loading = false
      }
      else {
        const categoriesRemaining$ = data.map(({ id }) => this.analyticsService.categoryRemaining(id).pipe(
            map(({ data }) => data)
          ))
          
        forkJoin(categoriesRemaining$).pipe(
          tap(() => this.loading = false),
        ).subscribe(categoriesRemainings => this.categoriesRemaining = categoriesRemainings)
      }
    })
  }
}
