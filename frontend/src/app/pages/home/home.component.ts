import { Component, OnInit } from '@angular/core';
import MonthDTO from 'src/app/DTOs/month';
import YearDTO from 'src/app/DTOs/year';
import { MonthService } from 'src/app/services/month/month.service';
import { YearService } from 'src/app/services/year/year.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  analyticsYear!: YearDTO
  analyticsMonth!: MonthDTO
  analyticsSelect: string = ''
  years!: YearDTO[]
  months!: MonthDTO[]

  constructor(
    private yearService: YearService,
    private monthService: MonthService,
  ) {}

  test() {
    console.log(this.years, this.months, this.analyticsYear, this.analyticsMonth)
  }

  ngOnInit(): void {
    this.yearService.list().subscribe(res => {
      this.years = res.data

      const lastYear = Math.max(...this.years.map(year => +year.year))

      this.analyticsYear = this.years.find(year => +year.year == lastYear)!

      this.getMonths()
    })
  }

  getMonths(): void {
    this.monthService.list(this.analyticsYear.id).subscribe(res => {
      this.months = res.data

      const lastMonth = Math.max(...this.months.map(month => +month.month))

      this.analyticsMonth = this.months.find(month => +month.month == lastMonth)!
    })
  }

  toggleSelect(option: string): void {
    this.analyticsSelect = this.analyticsSelect == option ? '' : option
  }

  recentExpensesAnalytics(): number {
    let thisMonthExpenses, lastMonthExpenses, result

    return 10
  }

  yearExpensesAnalytics(): number {
    let thisMonthExpenses, yearMeanExpenses, result

    return 23
  }

  sumAllExpenses(month: MonthDTO): number {
    return 0
  }

  getMostExpensiveCategory(): string {
    let mostExpensive

    return mostExpensive
  }

  getMostExpensiveGroup(): string {
    let mostExpensive

    return mostExpensive
  }
}
