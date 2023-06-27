import { Component, OnInit } from '@angular/core';
import { map, tap, forkJoin } from 'rxjs';
import YearDTO from 'src/app/DTOs/year';
import { YearService } from 'src/app/services/year/year.service';
import TableFilters from 'src/app/utils/interfaces/tableFilters';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import MonthDTO from 'src/app/DTOs/month';
import CategoryDTO from 'src/app/DTOs/category';
import GroupDTO from 'src/app/DTOs/group';
import ExpenseDTO from 'src/app/DTOs/expense';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  activeYear!: YearDTO['id']
  years: YearDTO[] = []
  expenses: ExpenseDTO[] = []
  loading = false;
  
  constructor(
    private yearService: YearService,
    private expensesService: ExpenseService,
  ) { }
  
  ngOnInit(): void {
    this.yearService.list().pipe(
      map(({ data }) => data),
      tap(years => {
        this.years = years
        
        this.activeYear = years[0].id
      })
    ).subscribe()
  }
  
  listExpenses({ months, categories, groups }: TableFilters) {
    let filters: MonthDTO[] | CategoryDTO[] | GroupDTO[]
    let key: 'month' | 'category' | 'group'
    
    if(groups.length) {
      filters = groups
      key = 'group'
    }
    else if(categories.length) {
      filters = categories
      key = 'category'
    }
    else if(months.length) {
      filters = months
      key = 'month'
    }
    
    if(key) {
      const forkJoinArr = filters.map(({ id }) => this.expensesService.list({ [key]: id }).pipe(
        map(({ data }) => data)
      ))
      
      forkJoin(forkJoinArr).pipe(
        map(filtersExpenses => filtersExpenses.flat()),
        tap(expenses => {
          this.expenses = expenses
          this.loading = false
        })
      ).subscribe()
    }
    else {
      this.expensesService.list({ year: this.activeYear }).pipe(
        map(({ data }) => data),
        tap(expenses => {
          this.expenses = expenses
          this.loading = false
        })
      ).subscribe()
    }
  }
}
