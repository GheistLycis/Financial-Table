import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { map, tap, forkJoin } from 'rxjs';
import YearDTO from 'src/app/shared/DTOs/year';
import { YearService } from 'src/app/shared/services/year/year.service';
import TableFilters from 'src/app/shared/interfaces/tableFilters';
import { ExpenseService } from 'src/app/shared/services/expense/expense.service';
import MonthDTO from 'src/app/shared/DTOs/month';
import CategoryDTO from 'src/app/shared/DTOs/category';
import GroupDTO from 'src/app/shared/DTOs/group';
import ExpenseDTO from 'src/app/shared/DTOs/expense';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralWarningComponent } from 'src/app/shared/components/modals/general-warning/general-warning.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Output() expensesUpdated = new EventEmitter<void>()
  activeYear!: YearDTO['id']
  years: YearDTO[] = []
  expenses: ExpenseDTO[] = []
  filters!: TableFilters
  loading = false
  
  constructor(
    private yearService: YearService,
    private expensesService: ExpenseService,
    private modalService: NgbModal,
    private toastr: ToastrService,
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
  
  listExpenses(filter: TableFilters) {
    const { months, categories, groups } = filter
    let filters: MonthDTO[] | CategoryDTO[] | GroupDTO[]
    let key: 'month' | 'category' | 'group'
    
    this.filters = filter
    
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
        tap(expenses => this.expenses = expenses)
      ).subscribe({ 
        error: () => this.loading = false, 
        complete: () => this.loading = false 
      })
    }
    else {
      this.expensesService.list({ year: this.activeYear }).pipe(
        map(({ data }) => data),
        tap(expenses => this.expenses = expenses)
      ).subscribe({ 
        error: () => this.loading = false, 
        complete: () => this.loading = false 
      })
    }
  }
  
  editExpense(expense: ExpenseDTO) {
    
  }
  
  deleteExpense({ id, value, description }: ExpenseDTO) {
    const { componentInstance, result } = this.modalService.open(GeneralWarningComponent, { size: 'md' })
    
    componentInstance.title = 'Excluir registro'
    componentInstance.text = `Deseja realmente excluir este registro de gasto? <br><br> <b>R$${value.toString()} - ${description}</b>`
    
    result.then(res => res && 
      this.expensesService.delete(id).subscribe(() => {
        this.toastr.success('Excluído com sucesso!')
        
        this.expensesUpdated.emit()
        
        this.listExpenses(this.filters)
      })
    )
  }
}
