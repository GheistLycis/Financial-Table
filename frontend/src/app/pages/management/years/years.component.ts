import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import YearDTO from 'src/app/shared/DTOs/year';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';
import { YearService } from 'src/app/shared/services/year/year.service';


type yearAnalytics = {
  year: YearDTO
  available: number
  incomes: number
  fixedExpenses: number
  variableExpenses: number
}

@Component({
  selector: 'app-years',
  templateUrl: './years.component.html',
  styleUrls: ['./years.component.scss']
})
export class YearsComponent implements OnInit {
  yearsAnalytics$ = new BehaviorSubject<yearAnalytics[]>([])
  
  constructor(
    private yearService: YearService,
    private expenseService: ExpenseService,
  ) { }
  
  ngOnInit(): void {
    // this.yearService.list().pipe(
    //   map(({ data }) => {
    //     const requests = data.map(({ year, id }) => {
    //       return {
    //         year,
    //         request: this.expenseService.list({ year: id })
    //       }
    //     })
    //   })
    // ).subscribe({ next: data => this.yearsAnalytics$.next([ ...this.yearsAnalytics$.getValue(), data ])})
  }
  
  addYear(): void {
    
  }
}
