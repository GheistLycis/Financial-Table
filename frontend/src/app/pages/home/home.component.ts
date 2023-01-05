import { Component, OnInit } from '@angular/core';
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
import { CategoryService } from 'src/app/services/category/category.service';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { GroupService } from 'src/app/services/group/group.service';
import { MonthService } from 'src/app/services/month/month.service';
import { YearService } from 'src/app/services/year/year.service';

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
  list: ExpenseDTO[] = []
  filteredList: ExpenseDTO[] = []
  filters = { category: null, group: null }
  page = 1
  pageSize = 10
  collectionSize = this.list.length

  constructor(
    private yearService: YearService,
    private monthService: MonthService,
    private categoryService: CategoryService,
    private groupService: GroupService,
    private expenseService: ExpenseService,
    private modalService: NgbModal,
  ) {}

  test() {
    console.log(this.years, this.months, this.analyticsYear, this.analyticsMonth)
  }

  ngOnInit(): void {
    this.yearService.list().subscribe(res => {
      this.years = res.data

      const lastYear = Math.max(...this.years.map(year => year.year))

      this.analyticsYear = this.years.find(year => year.year == lastYear)!

      this.getMonths()
    })
  }

  getMonths(): void {
    this.monthService.list({ year: this.analyticsYear.id }).subscribe(res => {
      this.months = res.data

      const lastMonth = Math.max(...this.months.map(month => month.month))

      this.analyticsMonth = this.months.find(month => month.month == lastMonth)!

      this.calculateAnalytics()
    })
  }

  calculateAnalytics() {
    this.calculateRecentExpenses()
    this.calculateYearExpenses()
    this.getMostExpensiveCategory()
    this.getMostExpensiveGroup()
  }

  async calculateRecentExpenses(): Promise<void> {
    let lastMonth, thisMonthExpenses

    this.expenseService.list({ month: this.analyticsMonth.id })
      .subscribe(res => thisMonthExpenses = res.data.reduce((acc, val) => acc += val.value, 0))

    if(this.analyticsMonth.month != 1) {
      lastMonth = this.months.find(month => month.month = this.analyticsMonth.month -1)
    }
    else {
      const lastYear = this.years.find(year => year.year == this.analyticsYear.year -1)!

      lastMonth = await firstValueFrom(this.monthService.list({ year: lastYear.id }))
        .then(res => res.data.find(month => month.month == 12))
    }
          
    this.expenseService.list(lastMonth.id).subscribe(res => {
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

  toggleSelect(option: string): void {
    this.analyticsSelect = this.analyticsSelect == option ? '' : option
  }

  openModal(option: 'year' | 'month' | 'category' | 'group' | 'expense' | 'monthly-entry'): void {
    let modal, modalRef

    if(option == 'year') modal = YearComponent
    if(option == 'month') modal = MonthComponent
    if(option == 'category') modal = CategoryComponent
    if(option == 'group') modal = GroupComponent
    if(option == 'expense') modal = ExpenseComponent
    if(option == 'monthly-entry') modal = MonthlyEntryComponent

    modalRef = this.modalService.open(modal, { size: 'lg' })

    modalRef.result
      .then()
      .catch()
  }

  searchFor(terms: string[]) {
    return this.list.filter(expense => {
      let rowMatches: boolean = true
      const fields: string[] = []
      const normalizedFields: string[] = []

      fields.push(
        expense.description.toLowerCase(),
        expense.value.toString(),
        expense.date.toLocaleDateString('pt-br'),
      )

      fields.forEach(field => {
        normalizedFields.push(
          field
            .replace(/[ãáàâ]/, 'a')
            .replace(/[éê]/, 'e')
            .replace(/[í]/, 'i')
            .replace(/[õóô]/, 'o')
            .replace(/[ú]/, 'u')
            .replace(/[ç]/, 'c')
        )
      })

      for (let term of terms) {
        let aFieldMatches = false

        term = term.toString().trim().toLowerCase()

        for (let i = 0; i < fields.length; i++) {
          if (fields[i].includes(term) || normalizedFields[i].includes(term)) {
            aFieldMatches = true
            break
          }
        }

        if (!aFieldMatches) {
          rowMatches = false
          break
        }
      }

      return rowMatches
    })
  }

  updateList(search?: any) {
    console.log(search)
    return
    if(search) {
      this.filteredList = this.searchFor(search.split(';'))
      this.collectionSize = this.filteredList.length
      this.page = 1
      this.pageSize = this.filteredList.length
    }
    else {
      this.pageSize = 20
      this.filteredList = this.list.slice(
          (this.page - 1) * this.pageSize,
          (this.page - 1) * this.pageSize + this.pageSize
        )
      this.collectionSize = this.list.length
    }
  }

  compareId(first: any, second: any) {
    return first.id == second.id
  }
}
