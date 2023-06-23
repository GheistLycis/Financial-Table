import { Component, OnInit } from '@angular/core';
import MonthDTO from 'src/app/DTOs/month';
import YearDTO from 'src/app/DTOs/year';
import { MonthService } from 'src/app/services/month/month.service';
import { YearService } from 'src/app/services/year/year.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  dropdown: '' | 'year' | 'month' = ''
  years: YearDTO[] = []
  year$ = new Subject<YearDTO>()
  months$ = new Subject<MonthDTO[]>()
  month$ = new Subject<MonthDTO>()
  
  constructor(
    private yearService: YearService,
    private monthService: MonthService,
  ) { }
  
  ngOnInit(): void {
    this.year$.subscribe(value => this.monthService.list({ year: value.id }).subscribe(({ data }) => this.months$.next(data)))
    
    this.months$.subscribe(value => this.month$.next(value[0]))
    
    this.month$.subscribe(() => this.calculateAnalytics())
    
    this.yearService.list().subscribe(({ data }) => {
      this.years = data
      
      this.year$.next(this.years[0])
    })
  }
  
  toggleSelect(option: 'year' | 'month'): void {
    this.dropdown = this.dropdown == option ? '' : option
  }
  
  calculateAnalytics(): void {

  }
}
