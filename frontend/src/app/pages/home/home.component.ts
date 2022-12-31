import { Component, OnInit } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';
import CategoryDTO from 'src/app/DTOs/category';
import ExpenseDTO from 'src/app/DTOs/expense';
import GroupDTO from 'src/app/DTOs/group';
import MonthDTO from 'src/app/DTOs/month';
import YearDTO from 'src/app/DTOs/year';
import { CategoryService } from 'src/app/services/category/category.service';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { GroupService } from 'src/app/services/group/group.service';
import { MonthService } from 'src/app/services/month/month.service';
import { YearService } from 'src/app/services/year/year.service';
import { Response as Res } from 'src/app/utils/interfaces/response';

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
  recentExpenses!: number | '--'
  yearExpenses!: number | '--'
  mostExpensiveCategory!: string
  mostExpensiveGroup!: string

  constructor(
    private yearService: YearService,
    private monthService: MonthService,
    private categoryService: CategoryService,
    private groupService: GroupService,
    private expenseService: ExpenseService,
  ) {}

  test() {
    console.log(this.years, this.months, this.analyticsYear, this.analyticsMonth)
  }

  ngOnInit(): void {
    this.yearService.list().subscribe((res: Res<YearDTO[]>) => {
      this.years = res.data

      const lastYear = Math.max(...this.years.map(year => year.year))

      this.analyticsYear = this.years.find(year => year.year == lastYear)!

      this.getMonths()
    })
  }

  getMonths(): void {
    this.monthService.list({ year: this.analyticsYear.id }).subscribe((res: Res<MonthDTO[]>) => {
      this.months = res.data

      const lastMonth = Math.max(...this.months.map(month => +month.month))

      this.analyticsMonth = this.months.find(month => month.month == lastMonth)!

      this.calculateRecentExpenses()
      this.calculateYearExpenses()
      this.getMostExpensiveCategory()
      this.getMostExpensiveGroup()
    })
  }

  async calculateRecentExpenses(): Promise<void> {
    let lastMonth, thisMonthExpenses

    this.expenseService.list({ month: this.analyticsMonth.id })
      .subscribe((res: Res<ExpenseDTO[]>) => thisMonthExpenses = res.data.reduce((acc, val) => acc += val.value, 0))

    if(this.analyticsMonth.month != 1) {
      lastMonth = this.months.find(month => month.month = this.analyticsMonth.month -1)
    }
    else {
      const lastYear = this.years.find(year => year.year == this.analyticsYear.year -1)!

      lastMonth = await firstValueFrom(this.monthService.list({ year: lastYear.id }))
        .then((res: Res<MonthDTO[]>) => res.data.find(month => month.month == 12))
    }
          
    this.expenseService.list(lastMonth.id).subscribe((res: Res<ExpenseDTO[]>) => {
      const lastMonthExpenses = res.data.reduce((acc, val) => acc += val.value, 0)

      this.recentExpenses = thisMonthExpenses && lastMonthExpenses
        ? ((100 * thisMonthExpenses / lastMonthExpenses) -100) 
        : '--'
    })
  }

  async calculateYearExpenses(): Promise<void> {
    let thisMonthExpenses
    const lastMonthsExpenses: number[] = []

    this.expenseService.list({ month: this.analyticsMonth.id })
      .subscribe((res: Res<ExpenseDTO[]>) => thisMonthExpenses = res.data.reduce((acc, val) => acc += val.value, 0))

    const lastMonths = await firstValueFrom(this.monthService.list({ year: this.analyticsYear.id }))
      .then((res: Res<MonthDTO[]>) => res.data.filter(month => month.month < this.analyticsMonth.month))

    if(!lastMonths.length || !thisMonthExpenses) {
      this.yearExpenses = '--'
      return
    }

    for(let month of lastMonths) {
      const sum = await firstValueFrom(this.expenseService.list({ month: month.id }))
        .then((res: Res<ExpenseDTO[]>) => res.data.reduce((acc, val) => acc += val.value, 0))

      lastMonthsExpenses.push(sum)
    }

    const yearMeanExpenses = lastMonthsExpenses.reduce((acc, val) => acc += val, 0) / lastMonths.length

    this.yearExpenses = yearMeanExpenses 
      ? ((100 * thisMonthExpenses / yearMeanExpenses) -100) 
      : '--'
  }

  getMostExpensiveCategory(): void {
    const expensesByCategory: { [k: string]: number } = {}

    this.categoryService.list({ month: this.analyticsMonth.id }).subscribe((categories: Res<CategoryDTO[]>) => {
      for(let i = 0; i < categories.data.length; i++) {
        const category = categories.data[i]

        this.expenseService.list({ category: category.id }).subscribe((expenses: Res<ExpenseDTO[]>) => {
          expensesByCategory[category.name] = expenses.data.reduce((acc, val) => acc += val.value, 0)

          if(i == categories.data.length-1) setTimeout(() => {
              let mostExpensiveCategory
              let max = -1

              for(let category in expensesByCategory) {
                if(expensesByCategory[category] > max) {
                  mostExpensiveCategory = category
                  max = expensesByCategory[category]
                } 
              }

              this.mostExpensiveCategory = mostExpensiveCategory
            }, 500)
        })
      }
    })
  }

  getMostExpensiveGroup(): void {
    const expensesByGroup: { [k: string]: number } = {}

    this.groupService.list({ month: this.analyticsMonth.id }).subscribe((groups: Res<GroupDTO[]>) => {
      for(let i = 0; i < groups.data.length; i++) {
        const group = groups.data[i]

        this.expenseService.list({ group: group.id }).subscribe((expenses: Res<ExpenseDTO[]>) => {
          expensesByGroup[group.name] = expenses.data.reduce((acc, val) => acc += val.value, 0)

          if(i == groups.data.length-1) setTimeout(() => {
              let mostExpensiveGroup
              let max = -1

              for(let group in expensesByGroup) {
                if(expensesByGroup[group] > max) {
                  mostExpensiveGroup = group
                  max = expensesByGroup[group]
                } 
              }

              this.mostExpensiveGroup = mostExpensiveGroup
            }, 500)
        })
      }
    })
  }

  toggleSelect(option: string): void {
    this.analyticsSelect = this.analyticsSelect == option ? '' : option
  }
}
