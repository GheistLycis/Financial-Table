import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import MonthDTO from 'src/app/shared/DTOs/month';
import MonthForm from 'src/app/shared/classes/MonthForm';
import { MonthService } from 'src/app/shared/services/month/month.service';
import { YearService } from 'src/app/shared/services/year/year.service';
import YearDTO from 'src/app/shared/DTOs/year';
import { Observable, map, tap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-month',
  templateUrl: './add-edit-month.component.html',
  styleUrls: ['./add-edit-month.component.scss']
})
export class AddEditMonthComponent {
  @Input() month?: MonthDTO
  @ViewChild('formModel') formModel!: NgForm
  form = new MonthForm()
  action: 'editar' | 'adicionar' = 'adicionar'
  submitted = false
  years$!: Observable<YearDTO[]> 
  loading = false
  
  constructor(
    protected activeModal: NgbActiveModal,
    private yearService: YearService,
    private monthService: MonthService,
    public router: Router,
  ) { 
    this.years$ = this.yearService.list().pipe(
        map(({ data }) => data),
        filter(data => data.length != 0),
        tap(years => this.form.year = years[0].id)
      )
  }
  
  ngOnInit(): void {
    if(this.month) {
      this.action = 'editar'
      
      const { month, available, obs, year } = this.month
      
      this.form = {
        month,
        available,
        obs,
        year: year.id
      }
    }
    else {
      this.form.month = new Date().getMonth() + 1
    }
  }
  
  validateForm(): void {    
    this.submitted = true
    
    if(this.formModel.invalid) return

    this.form.available = +this.form.available
    
    this.submit()
  }
  
  submit(): void {
    const service = this.action == 'adicionar'
      ? (obj: MonthForm) => this.monthService.post(obj)
      : (obj: MonthForm) => this.monthService.put(this.month.id, obj)
    
    this.loading = true
    
    service(this.form).subscribe({
      complete: () => this.activeModal.close(true),
      error: () => this.activeModal.close(false)
    })
  }
  
  get f(): FormGroup['controls'] {
    return this.formModel.form.controls
  }
}
