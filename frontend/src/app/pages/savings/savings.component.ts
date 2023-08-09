import { Component, OnInit } from '@angular/core';
import { AddEditSavingComponent } from './components/add-edit-saving/add-edit-saving.component';
import SavingDTO from '@DTOs/saving';
import { SavingService } from '@services/saving/saving.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralWarningComponent } from '@components/modals/general-warning/general-warning.component';
import { AnalyticsService } from '@services/analytics/analytics.service';
import { MonthService } from '@services/month/month.service';
import { switchMap, tap, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { YearService } from '@services/year/year.service';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.scss']
})
export class SavingsComponent implements OnInit {
  savings: SavingDTO[] = []
  actualBalance: number = 0.001
  loading = false
  
  constructor(
    private savingService: SavingService,
    private monthService: MonthService,
    private yearService: YearService,
    private analyticsService: AnalyticsService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) { }
  
  ngOnInit(): void {
    this.loading = true

    this.listSavings()
    
    this.yearService.list().pipe(
      map(({ data }) => data[0]),
      switchMap(({ id }) => this.monthService.list({ year: id }).pipe(
          map(({ data }) => data[0]),
          switchMap(({ id }) => this.analyticsService.monthBalance(id).pipe(
            map(({ data }) => data)
          )),
        )
      ),
      catchError(() => of(null)),
      tap(data => {
        this.loading = false
        if(data) this.actualBalance = data.balance
      }),
    ).subscribe()
  }

  listSavings(): void {
    this.loading = true
    this.savingService.list().subscribe(({ data }) => {
      this.savings = data
      this.loading = false
    })
  }
  
  addSaving(): void {
    const { result } = this.modalService.open(AddEditSavingComponent, { size: 'lg' })
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Criado com sucesso!')
        
        this.listSavings()
      }
    })
  }
  
  editSaving(saving: SavingDTO): void {
    const { componentInstance, result } = this.modalService.open(AddEditSavingComponent, { size: 'lg' })
    
    componentInstance.saving = saving
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Editado com sucesso!')
        
        this.listSavings()
      }
    })
  }
  
  deleteSaving({ id, title, amount, dueDate }: SavingDTO): void {
    const { componentInstance, result } = this.modalService.open(GeneralWarningComponent, { size: 'md' })
    
    componentInstance.title = 'Excluir caixinha'
    componentInstance.text = `
      Deseja realmente excluir a caixinha <b>${title} - R$${amount} ${dueDate ? '(' + dueDate.toString() + ')' : ''}</b>?`
    
    result.then((res: boolean) => res && 
      this.savingService.delete(id).subscribe(() => {
        this.toastr.success('Excluído com sucesso!')
        
        this.listSavings()
      })
    )
  }
  
  updateStatus(id: SavingDTO['id'], status: SavingDTO['status']): void {
    this.savingService.updateStatus(id, status).subscribe(() => {
      if(status == 'active') {
        this.toastr.success('Caixinha reativada!')
      }
      if(status == 'completed') {
        this.toastr.success('Caixinha finalizada!')
      }
      if(status == 'canceled') {
        this.toastr.success('Caixinha suspensa!')
      }
      
      this.listSavings()
    })
  }
  
  floor(n: number): number {
    return Math.floor(n)
  }
}
