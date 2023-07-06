import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import CategoryDTO from 'src/app/shared/DTOs/category';
import GroupDTO from 'src/app/shared/DTOs/tag';
import GroupForm from 'src/app/shared/classes/TagForm';
import { GroupService } from 'src/app/shared/services/tag/tag.service';

@Component({
  selector: 'app-add-edit-group',
  templateUrl: './add-edit-group.component.html',
  styleUrls: ['./add-edit-group.component.scss']
})
export class AddEditGroupComponent implements OnInit {
  @Input() category?: CategoryDTO
  @Input() group?: GroupDTO
  @ViewChild('formModel') formModel!: NgForm
  form = new GroupForm()
  action: 'editar' | 'adicionar' = 'adicionar'
  submitted = false
  
  constructor(
    protected activeModal: NgbActiveModal,
    private groupService: GroupService,
  ) { }
  
  ngOnInit(): void {
    if(this.group) {
      this.action = 'editar'
      
      const { name, color, category } = this.group
      
      this.form = {
        name,
        color,
        category: category.id
      }
    }
    else if(this.category) {
      this.form.category = this.category.id
    }
  }
  
  validateForm(): void {
    this.submitted = true
    
    this.form.color = this.form.color.toString()
    
    this.submit()
  }
  
  submit(): void {
    const service = this.action == 'adicionar'
      ? (obj: GroupForm) => this.groupService.post(obj)
      : (obj: GroupForm) => this.groupService.put(this.group.id, obj)
    
    service(this.form).subscribe({
      complete: () => this.activeModal.close(true),
      error: () => this.activeModal.close(false)
    })
  }
  
  get f(): FormGroup['controls'] {
    return this.formModel.form.controls
  }
}
