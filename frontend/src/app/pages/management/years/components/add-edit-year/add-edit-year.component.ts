import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import YearDTO from 'src/app/shared/DTOs/year';
import YearForm from 'src/app/shared/classes/YearForm';
import { YearService } from 'src/app/shared/services/year/year.service';

@Component({
  selector: 'app-add-edit-year',
  templateUrl: './add-edit-year.component.html',
  styleUrls: ['./add-edit-year.component.scss']
})
export class AddEditYearComponent implements OnInit {
  @Input() year?: YearDTO
  @ViewChild('formModel') formModel!: NgForm
  form = new YearForm()
  action: 'editar' | 'adicionar' = 'adicionar'
  submitted = false
  loading = false
  
  constructor(
    protected activeModal: NgbActiveModal,
    private yearService: YearService,
  ) { }
  
  ngOnInit(): void {
    if(this.year) {
      this.action = 'editar'
      
      const { year } = this.year
      
      this.form = {
        year
      }
    }
  }
  
  validateForm(): void {    
    this.submitted = true
    
    if(this.formModel.invalid) return
    
    this.submit()
  }
  
  submit(): void {
    const service = this.action == 'adicionar'
      ? (obj: YearForm) => this.yearService.post(obj)
      : (obj: YearForm) => this.yearService.put(this.year.id, obj)
    
    
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
