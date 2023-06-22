import { Component, OnInit } from '@angular/core';
import MonthDTO from 'src/app/DTOs/month';
import YearDTO from 'src/app/DTOs/year';
import { MonthService } from 'src/app/services/month/month.service';
import { YearService } from 'src/app/services/year/year.service';
import { Observable, map, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  dropdown: '' | 'year' | 'month' = ''
  years$!: Observable<YearDTO[]>
  months$!: Observable<MonthDTO[]>
  year!: YearDTO
  month!: MonthDTO
  
  constructor(
    private yearService: YearService,
    private monthService: MonthService,
  ) {
    this.years$ = this.yearService.list().pipe(
      map(res => res.data),
      tap(([ lastestYear ]) => {
        this.year = lastestYear
        
        this.months$ = this.monthService.list({ year: lastestYear.id }).pipe(
          map(res => res.data),
          tap(([ latestMonth ]) => this.month = latestMonth),
        )
        
        this.months$.subscribe()
      }),
    )
  }
  
  ngOnInit(): void {
    this.years$.subscribe()
  }
  
  toggleSelect(option: 'year' | 'month'): void {
    this.dropdown = this.dropdown == option ? '' : option
  }
  
  calculateAnalytics(): void {

  }
}
