import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import MonthDTO from 'src/app/shared/DTOs/month';
import MonthDuplicationForm from 'src/app/shared/classes/MonthDuplicationForm';
import { GeneralWarningComponent } from 'src/app/shared/components/modals/general-warning/general-warning.component';
import { MonthService } from 'src/app/shared/services/month/month.service';

@Component({
  selector: 'app-duplicate-month',
  templateUrl: './duplicate-month.component.html',
  styleUrls: ['./duplicate-month.component.scss']
})
export class DuplicateMonthComponent {
  @Input() month!: MonthDTO
  @ViewChild('formModel') formModel!: NgForm
  form = new MonthDuplicationForm()
  loading = false
  
  constructor(
    protected activeModal: NgbActiveModal,
    private monthService: MonthService,
    private modalService: NgbModal,
  ) { }
  
  submit(): void {
    const { componentInstance, result } = this.modalService.open(GeneralWarningComponent, { size: 'md' })
    const duplications = Object.entries(this.form)
      .filter(([ key, val]) => val)
      .map(([ key ]) => {
        if(key == 'duplicateMonthlyIncomes') return 'Entradas'
        if(key == 'duplicateMonthlyExpenses') return 'Mensalidades'
        else return 'Categorias'
      })
    
    componentInstance.title = 'Duplicar mês'
    componentInstance.text = `
      <p>Isto criará um mês seguinte copiando todos os parâmetros selecionados:</p>
      <ul>
        ${duplications.map(el => '<li>' + el + '</li>').join('')}
      </ul>
    `
    
    result.then((res: boolean) => {
      if(res) {
        this.loading = true
        
        this.monthService.duplicate(this.month.id, this.form).subscribe({
          complete: () => this.activeModal.close(true),
          error: () => this.activeModal.close(false)
        }) 
      }
    })
  }
}
