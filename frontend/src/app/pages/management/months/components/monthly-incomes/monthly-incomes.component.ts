import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import MonthDTO from 'src/app/shared/DTOs/month';
import { MonthlyIncomeService } from 'src/app/shared/services/monthly-income/monthly-income.service';
import { AddEditMonthlyIncomeComponent } from './components/add-edit-monthly-income/add-edit-monthly-income.component';
import MonthlyIncomeDTO from 'src/app/shared/DTOs/monthlyIncome';
import { GeneralWarningComponent } from 'src/app/shared/components/modals/general-warning/general-warning.component';
import { monthNames } from 'src/app/shared/enums/monthNames';
import { MonthNamePipe } from 'src/app/shared/pipes/month-name/month-name.pipe';

@Component({
  selector: 'app-monthly-incomes',
  templateUrl: './monthly-incomes.component.html',
  styleUrls: ['./monthly-incomes.component.scss'],
  providers: [MonthNamePipe],
})
export class MonthlyIncomesComponent implements OnInit {
  @Input() month!: MonthDTO
  incomes: MonthlyIncomeDTO[] = []
  
  constructor(
    private monthlyIncomeService: MonthlyIncomeService,
    private modalService: NgbModal,
    protected activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private monthNamePipe: MonthNamePipe,
  ) { }
  
  ngOnInit(): void {
    this.listIncomes()
  }
  
  listIncomes(): void {
    this.monthlyIncomeService.list({ month: this.month.id }).subscribe(({ data }) => this.incomes = data)
  }
  
  addIncome(): void {
    const { componentInstance, result } = this.modalService.open(AddEditMonthlyIncomeComponent, { size: 'md' })
    
    componentInstance.month = this.month
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Criado com sucesso!')
        
        this.listIncomes()
      }
    })
  }
  
  editIncome(income: MonthlyIncomeDTO): void {
    const { componentInstance, result } = this.modalService.open(AddEditMonthlyIncomeComponent, { size: 'lg' })
    
    componentInstance.income = income
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Editado com sucesso!')
        
        this.listIncomes()
      }
    })
  }
  
  deleteIncome({ month, value, description, id }: MonthlyIncomeDTO): void {
    const { componentInstance, result } = this.modalService.open(GeneralWarningComponent, { size: 'md' })
    
    componentInstance.title = 'Excluir entrada mensal'
    componentInstance.text = `
      Deseja realmente excluir esta entrada de ${this.monthNamePipe.transform(month.month)}? <br><br> <b>R$${value.toString()} - ${description}</b>`
    
    result.then((res: boolean) => res && 
      this.monthlyIncomeService.delete(id).subscribe(() => {
        this.toastr.success('Excluído com sucesso!')
        
        this.listIncomes()
      })
    )
  }
}
