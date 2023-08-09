import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import TagDTO from '@DTOs/tag';
import TagForm from '@classes/TagForm';
import GroupForm from '@classes/TagForm';
import { TagService } from '@services/tag/tag.service';

@Component({
  selector: 'app-add-edit-tag',
  templateUrl: './add-edit-tag.component.html',
  styleUrls: ['./add-edit-tag.component.scss']
})
export class AddEditTagComponent implements OnInit {
  @Input() tag?: TagDTO
  @ViewChild('formModel') formModel!: NgForm
  form = new GroupForm()
  action: 'editar' | 'adicionar' = 'adicionar'
  submitted = false
  loading = false
  
  constructor(
    protected activeModal: NgbActiveModal,
    private groupService: TagService,
  ) { }
  
  ngOnInit(): void {
    if(this.tag) {
      this.action = 'editar'
      
      const { name, color } = this.tag
      
      this.form = {
        name,
        color,
      }
    }
  }
  
  validateForm(): void {
    this.submitted = true
    
    this.form.color = this.form.color.toString()
    
    if(this.formModel.invalid) return
    
    this.submit()
  }
  
  submit(): void {
    const service = this.action == 'adicionar'
      ? (obj: TagForm) => this.groupService.post(obj)
      : (obj: TagForm) => this.groupService.put(this.tag.id, obj)
    
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
