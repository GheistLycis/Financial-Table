import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, concatMap, from, map, switchMap } from 'rxjs';
import YearHistory from 'src/app/shared/interfaces/YearHistory';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { YearService } from 'src/app/shared/services/year/year.service';


@Component({
  selector: 'app-years',
  templateUrl: './years.component.html',
  styleUrls: ['./years.component.scss']
})
export class YearsComponent implements OnInit {
  yearsHistories$ = new BehaviorSubject<YearHistory[]>([])
  
  constructor(
    private yearService: YearService,
    private analyticsService: AnalyticsService,
  ) { }
  
  ngOnInit(): void {
    const years$ = this.yearService.list().pipe(
      switchMap(({ data }) => from(data))
    )
    
    const histories$ = years$.pipe(
      concatMap(({ id }) => this.analyticsService.yearHistory(id).pipe(
        map(({ data }) => data)
      ))
    )
    
    histories$.pipe(
      map(history => this.yearsHistories$.getValue().concat(history))
    ).subscribe(this.yearsHistories$)
  }
  
  addYear(): void {
    
  }
}
