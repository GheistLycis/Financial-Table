import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { CategoryComponent } from 'src/app/components/modal/category/category.component';
import { ExpenseComponent } from 'src/app/components/modal/expense/expense.component';
import { GroupComponent } from 'src/app/components/modal/group/group.component';
import { MonthComponent } from 'src/app/components/modal/month/month.component';
import { MonthlyEntryComponent } from 'src/app/components/modal/monthly-entry/monthly-entry.component';
import { YearComponent } from 'src/app/components/modal/year/year.component';
import ExpenseDTO from 'src/app/DTOs/expense';
import MonthDTO from 'src/app/DTOs/month';
import YearDTO from 'src/app/DTOs/year';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { GroupService } from 'src/app/services/group/group.service';
import { MonthService } from 'src/app/services/month/month.service';
import { YearService } from 'src/app/services/year/year.service';
import { filterList } from 'src/app/utils/filterList';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // GENERAL
  years!: YearDTO[]
  months!: MonthDTO[]

  // ANALYTICS
  analyticsYear!: YearDTO
  analyticsMonth!: MonthDTO
  analyticsSelect: string = ''
  recentExpenses!: number | '--'
  yearExpenses!: number | '--'
  mostExpensiveCategory!: string
  mostExpensiveGroup!: string 

  // EXPENSES TABLE
  list: {
    [year: string]: {
      [month: string]: ExpenseDTO[],
    },
  } = {}
  filteredList: {
    [year: string]: {
      [month: string]: ExpenseDTO[],
    },
  } = {}
  filters = { category: new FormControl(null), group: new FormControl(null) }
  searchColumns = ['value', 'description', 'date']

  constructor(
    private analyticsService: AnalyticsService,
    private yearService: YearService,
    private monthService: MonthService,
    private categoryService: CategoryService,
    private groupService: GroupService,
    private expenseService: ExpenseService,
    private modalService: NgbModal,
  ) {}

  async ngOnInit(): Promise<void> {
    await firstValueFrom(this.yearService.fetchAll())
      .then(({ data }) => {
        console.log(data)

        this.years = data
        this.analyticsYear = this.years[0]

        this.months = this.analyticsYear.months
        this.analyticsMonth = this.months[0]

        this.years.forEach(year => {
          const monthsObj = {}

          year.months.forEach(month => {
            let groups = []
            let expenses = []

            month.categories.map(category => groups.push(...category.groups))
            
            groups.forEach(group => expenses.push(...group.expenses))

            monthsObj[month.month] = expenses
          })

          this.list[year.year] = monthsObj
        })

        console.log(this.list)

        this.filteredList = this.list

        this.calculateAnalytics()
      })
  }

  calculateAnalytics() {
    // this.calculateRecentExpenses()
    // this.calculateYearExpenses()
    // this.getMostExpensiveCategory()
    // this.getMostExpensiveGroup()
  }

  async calculateRecentExpenses(): Promise<void> {
    const thisMonthExpenses = await firstValueFrom(this.expenseService.list({ month: this.analyticsMonth.id }))
      .then(({ data }) => data.reduce((acc, val) => acc += val.value, 0))

    const lastMonth = this.analyticsMonth.month != 1
      ? this.months.find(month => month.month = this.analyticsMonth.month-1)!
      : this.years.find(year => year.year == this.analyticsYear.year-1)!.months[0]
          
    this.expenseService.list({ month: lastMonth.id }).subscribe(({ data }) => {
      const lastMonthExpenses = data.reduce((acc, val) => acc += val.value, 0)

      this.recentExpenses = thisMonthExpenses && lastMonthExpenses
        ? ((100 * thisMonthExpenses / lastMonthExpenses) -100) 
        : '--'
    })
  }

  async calculateYearExpenses(): Promise<void> {
    let thisMonthExpenses
    const lastMonthsExpenses: number[] = []

    this.expenseService.list({ month: this.analyticsMonth.id })
      .subscribe(res => thisMonthExpenses = res.data.reduce((acc, val) => acc += val.value, 0))

    const lastMonths = await firstValueFrom(this.monthService.list({ year: this.analyticsYear.id }))
      .then(res => res.data.filter(month => month.month < this.analyticsMonth.month))

    if(!lastMonths.length || !thisMonthExpenses) {
      this.yearExpenses = '--'
      return
    }

    for(let month of lastMonths) {
      const sum = await firstValueFrom(this.expenseService.list({ month: month.id }))
        .then(res => res.data.reduce((acc, val) => acc += val.value, 0))

      lastMonthsExpenses.push(sum)
    }

    const yearMeanExpenses = lastMonthsExpenses.reduce((acc, val) => acc += val, 0) / lastMonths.length

    this.yearExpenses = yearMeanExpenses 
      ? ((100 * thisMonthExpenses / yearMeanExpenses) -100) 
      : '--'
  }

  getMostExpensiveCategory(): void {
    const expensesByCategory: { [k: string]: number } = {}

    this.categoryService.list({ month: this.analyticsMonth.id }).subscribe(categories => {
      for(let i = 0; i < categories.data.length; i++) {
        const category = categories.data[i]

        this.expenseService.list({ category: category.id }).subscribe(expenses => {
          expensesByCategory[category.name] = expenses.data.reduce((acc, val) => acc += val.value, 0)

          if(i == categories.data.length-1) setTimeout(() => {
              let mostExpensiveCategory = '--'
              let max = 0

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

    this.groupService.list({ month: this.analyticsMonth.id }).subscribe(groups => {
      for(let i = 0; i < groups.data.length; i++) {
        const group = groups.data[i]

        this.expenseService.list({ group: group.id }).subscribe(expenses => {
          expensesByGroup[group.name] = expenses.data.reduce((acc, val) => acc += val.value, 0)

          if(i == groups.data.length-1) setTimeout(() => {
              let mostExpensiveGroup = '--'
              let max = 0

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

  toggleSelect(option: 'year' | 'month'): void {
    this.analyticsSelect = this.analyticsSelect == option ? '' : option
  }

  openModal(type: string, item: any = null): void {
    let modal, modalRef

    if(type == 'year') modal = YearComponent
    if(type == 'month') modal = MonthComponent
    if(type == 'category') modal = CategoryComponent
    if(type == 'group') modal = GroupComponent
    if(type == 'expense') modal = ExpenseComponent
    if(type == 'monthly-entry') modal = MonthlyEntryComponent

    modalRef = this.modalService.open(modal, { size: 'lg' })

    modalRef.componentInstance.item = item

    modalRef.result
      .then()
      .catch()
  }

  updateList(year: number, month: number, search: any) {
    this.filteredList[year][month] = filterList(this.list[year][month], search.value.split(';'), this.searchColumns)
  }

  compareId(first: any, second: any) {
    return first.id == second.id
  }
}
