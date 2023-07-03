import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, forkJoin } from 'rxjs';
import YearHistory from 'src/app/shared/interfaces/YearHistory';
import { AnalyticsService } from 'src/app/shared/services/analytics/analytics.service';
import { YearService } from 'src/app/shared/services/year/year.service';
import { AddEditYearComponent } from './components/add-edit-year/add-edit-year.component';
import { ToastrService } from 'ngx-toastr';
import YearDTO from 'src/app/shared/DTOs/year';
import { GeneralWarningComponent } from 'src/app/shared/components/modals/general-warning/general-warning.component';


@Component({
  selector: 'app-years',
  templateUrl: './years.component.html',
  styleUrls: ['./years.component.scss']
})
export class YearsComponent implements OnInit {
  yearsHistories: YearHistory[] = []
  
  constructor(
    private yearService: YearService,
    private analyticsService: AnalyticsService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) { }
  
  ngOnInit(): void {
    this.listHistories()
  }
  
  listHistories(): void {
    this.yearService.list().subscribe(({ data }) => {
      const histories$ = data.map(({ id }) => this.analyticsService.yearHistory(id).pipe(
          map(({ data }) => data)
        ))
      
      forkJoin(histories$).subscribe(histories => this.yearsHistories = histories)
    })
  }
  
  addYear(): void {
    const { result } = this.modalService.open(AddEditYearComponent, { size: 'lg' })
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Criado com sucesso!')
        
        this.listHistories()
      }
    })
  }
  
  editYear(year: YearDTO): void {
    const { componentInstance, result } = this.modalService.open(AddEditYearComponent, { size: 'lg' })
    
    componentInstance.year = year
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Editado com sucesso!')
        
        this.listHistories()
      }
    })
  }
  
  deleteYear({ id, year }: YearDTO) {
    const { componentInstance, result } = this.modalService.open(GeneralWarningComponent, { size: 'md' })
    
    componentInstance.title = 'Excluir ano'
    componentInstance.text = `
      Deseja realmente excluir o ano de ${year}? 
      <b>Tudo</b> que está registrado nele - registros, grupos, categorias e meses - será <b>perdido!</b>`
    
    result.then((res: boolean) => res && 
      this.yearService.delete(id).subscribe(() => {
        this.toastr.success('Excluído com sucesso!')
        
        this.listHistories()
      })
    )
  }
}
