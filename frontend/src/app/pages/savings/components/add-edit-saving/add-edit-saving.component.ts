import { Component, ViewChild, Input } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import SavingDTO from '@DTOs/saving';
import SavingForm from '@classes/SavingForm';
import { SavingService } from '@services/saving/saving.service';

@Component({
  selector: 'app-add-edit-saving',
  templateUrl: './add-edit-saving.component.html',
  styleUrls: ['./add-edit-saving.component.scss']
})
export class AddEditSavingComponent {
  @Input() saving?: SavingDTO
  @ViewChild('formModel') formModel!: NgForm
  form = new SavingForm()
  action: 'editar' | 'adicionar' = 'adicionar'
  submitted = false
  loading = false
  
  constructor(
    protected activeModal: NgbActiveModal,
    private savingService: SavingService,
  ) { }
  
  ngOnInit(): void {
    if(this.saving) {
      this.action = 'editar'
      
      const { title, description, amount, dueDate } = this.saving
      
      this.form = {
        title,
        description,
        amount,
        dueDate
      }
    }
  }
  
  validateForm(): void {    
    this.submitted = true
    
    if(this.formModel.invalid) return

    if(`${this.form.dueDate}` == '') this.form.dueDate = null
    
    this.submit()
  }
  
  submit(): void {
    const service = this.action == 'adicionar'
      ? (obj: SavingForm) => this.savingService.post(obj)
      : (obj: SavingForm) => this.savingService.put(this.saving.id, obj)
    
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
