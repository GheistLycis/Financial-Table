import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import YearDTO from 'src/app/shared/DTOs/year';
import MonthHistory from 'src/app/shared/interfaces/MonthHistory';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { MonthService } from 'src/app/shared/services/month/month.service';
import { YearService } from 'src/app/shared/services/year/year.service';
import { AddEditMonthComponent } from './components/add-edit-month/add-edit-month.component';
import MonthDTO from 'src/app/shared/DTOs/month';
import { GeneralWarningComponent } from 'src/app/shared/components/modals/general-warning/general-warning.component';
import { monthNames } from 'src/app/shared/enums/monthNames';
import { BehaviorSubject, skip, tap, forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-months',
  templateUrl: './months.component.html',
  styleUrls: ['./months.component.scss']
})
export class MonthsComponent {
  years: YearDTO[] = []
  activeYear$ = new BehaviorSubject<YearDTO['id']>(undefined)
  monthsHistories: MonthHistory[] = []
  loading = false
  
  constructor(
    private yearService: YearService,
    private monthService: MonthService,
    private analyticsService: AnalyticsService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) { 
    this.activeYear$.pipe(
      skip(1),
      tap(() => this.listHistories())
    ).subscribe()
  }
  
  ngOnInit(): void {
    this.yearService.list().pipe(
      tap(({ data }) => {
        this.years = data
        this.activeYear$.next(this.years[0].id)
      })
    ).subscribe()
  }
  
  listHistories(): void {
    this.loading = true
    
    this.monthService.list({ year: this.activeYear$.getValue() }).subscribe(({ data }) => {
      if(!data.length) this.monthsHistories = []
      else {
        const histories$ = data.map(({ id }) => this.analyticsService.monthHistory(id).pipe(
            map(({ data }) => data)
          ))
        
        forkJoin(histories$).subscribe({
          next: histories => {
            this.monthsHistories = histories.map(history => {
              const h: any = history
              h.balance = 0
              return h
            })
            this.loading = false
          },
          error: () => this.loading = false
        })
      }
    })
  }
  
  addMonth(): void {
    const { result } = this.modalService.open(AddEditMonthComponent, { size: 'xl' })
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Criado com sucesso!')
        
        this.listHistories()
      }
    })
  }
  
  editMonth(month: MonthDTO): void {
    const { componentInstance, result } = this.modalService.open(AddEditMonthComponent, { size: 'xl' })
    
    componentInstance.month = month
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Editado com sucesso!')
        
        this.listHistories()
      }
    })
  }
  
  deleteMonth({ id, month }: MonthDTO) {
    const { componentInstance, result } = this.modalService.open(GeneralWarningComponent, { size: 'md' })
    let monthName: string
    
    for(const m in monthNames) if(monthNames[m] == `${month}`) monthName = m
    
    componentInstance.title = 'Excluir mês'
    componentInstance.text = `
      Deseja realmente excluir o mês de ${monthName}? 
      <b>Tudo</b> que está registrado nele - registros, grupos e categorias - será <b>perdido!</b>`
    
    result.then((res: boolean) => res && 
      this.monthService.delete(id).subscribe(() => {
        this.toastr.success('Excluído com sucesso!')
        
        this.listHistories()
      })
    )
  }
}
