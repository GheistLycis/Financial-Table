import { Component, OnInit, Input } from '@angular/core';
import MonthDTO from '@DTOs/month';
import YearDTO from '@DTOs/year';
import { MonthService } from '@services/month/month.service';
import { YearService } from '@services/year/year.service';
import { CategoryService } from '@services/category/category.service';
import { AnalyticsService } from '@services/analytics/analytics.service';
import CategoryRemaining from '@interfaces/CategoryRemaining';
import { forkJoin, map, BehaviorSubject, Subject, skip, tap, switchMap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

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
  years$ = new BehaviorSubject<YearDTO[]>([])
  year$ = new Subject<YearDTO>()
  months$ = new BehaviorSubject<MonthDTO[]>([])
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
    private analyticsService: AnalyticsService,
    public router: Router,
  ) { }
  
  ngOnInit(): void {
    this.handleYears()
    this.handleMonths()
    
    this.yearService.list().pipe(
      map(({ data }) => data),
    ).subscribe(this.years$)
  }
  
  handleYears(): void {
    this.years$.pipe(
      filter(data => data.length != 0),
      tap(years => this.year$.next(years[0])),
    ).subscribe()
    
    this.year$.pipe(
      switchMap(({ id }) => this.monthService.list({ year: id })),
      map(({ data }) => data)
    ).subscribe(this.months$)
  }
  
  handleMonths(): void {
    this.months$.pipe(
      map(months => months?.[0])
    ).subscribe(this.month$)
    
    this.month$.pipe(
      skip(1),
      tap(() => this.calculateAnalytics()),
    ).subscribe()
  }
  
  calculateAnalytics(): void {
    const { value } = this.month$

    this.calculateActualBalance(value)
    this.calculateRecentExpenses(value)
    this.calculateYearExpenses(value)
    this.getMostExpensiveCategory(value)
    this.getMostExpensiveTags(value)
    this.listCategoriesRemaining(value)
  }
  
  calculateActualBalance(month?: MonthDTO): void {
    if(!month) {
      this.actualBalance$.next('--')
      return
    }

    const { id } = month

    this.loading = true

    this.analyticsService.monthBalance(id).pipe(
      tap(() => this.loading = false),
    ).subscribe(({ data }) => this.actualBalance$.next(data.balance || '--'))
  }
  
  calculateRecentExpenses(month?: MonthDTO): void {
    if(!month) {
      this.recentExpenses$.next('--')
      return
    }

    const { id } = month

    this.loading = true

    this.analyticsService.recentExpenses(id).pipe(
      tap(() => this.loading = false),
    ).subscribe(({ data }) => this.recentExpenses$.next(data))
  }
  
  calculateYearExpenses(month?: MonthDTO): void {
    if(!month) {
      this.yearExpenses$.next('--')
      return
    }

    const { id } = month

    this.loading = true
    
    if(month.month == 1) {
      this.yearExpenses$.next('--')
    }
    else {
      this.loading = true
      this.analyticsService.yearExpenses(id).pipe(
        tap(() => this.loading = false),
      ).subscribe(({ data }) => this.yearExpenses$.next(data))
    }
  }
  
  getMostExpensiveCategory(month?: MonthDTO): void {
    if(!month) {
      this.mostExpensiveCategory$.next({ name: '--', total: 0 })
      return
    }

    const { id } = month

    this.loading = true

    this.analyticsService.mostExpensiveCategory(id).pipe(
      tap(() => this.loading = false),
    ).subscribe(({ data }) => this.mostExpensiveCategory$.next(data))
  }
  
  getMostExpensiveTags(month?: MonthDTO): void {
    if(!month) {
      this.mostExpensiveTags$.next({ name: '--', total: 0 })
      return
    }

    const { id } = month

    this.loading = true

    this.analyticsService.mostExpensiveTags(id).pipe(
      tap(() => this.loading = false),
    ).subscribe(({ data }) => this.mostExpensiveTags$.next(data))
  }
  
  listCategoriesRemaining(month?: MonthDTO): void {
    if(!month) {
      this.categoriesRemaining = []
      return
    }

    const { id } = month

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
