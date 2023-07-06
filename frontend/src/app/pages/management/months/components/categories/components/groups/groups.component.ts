import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import CategoryDTO from 'src/app/shared/DTOs/category';
import GroupDTO from 'src/app/shared/DTOs/tag';
import { GroupService } from 'src/app/shared/services/tag/tag.service';
import { AddEditGroupComponent } from './components/add-edit-group/add-edit-group.component';
import { GeneralWarningComponent } from 'src/app/shared/components/modals/general-warning/general-warning.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  @Input() category!: CategoryDTO
  groups: GroupDTO[] = []
  
  constructor(
    private groupService: GroupService,
    private modalService: NgbModal,
    protected activeModal: NgbActiveModal,
    private toastr: ToastrService,
  ) { }
  
  ngOnInit(): void {
    this.listGroups()
  }
  
  listGroups(): void {
    this.groupService.list({ category: this.category.id }).subscribe(({ data }) => this.groups = data)
  }
  
  addGroup(): void {
    const { componentInstance, result } = this.modalService.open(AddEditGroupComponent, { size: 'md' })
    
    componentInstance.category = this.category
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Criado com sucesso!')
        
        this.listGroups()
      }
    })
  }
  
  editGroup(group: GroupDTO): void {
    const { componentInstance, result } = this.modalService.open(AddEditGroupComponent, { size: 'lg' })
    
    componentInstance.group = group
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Editado com sucesso!')
        
        this.listGroups()
      }
    })
  }
  
  deleteGroup({ name, category, id }: GroupDTO): void {
    const { componentInstance, result } = this.modalService.open(GeneralWarningComponent, { size: 'md' })
    
    componentInstance.title = 'Excluir grupo'
    componentInstance.text = `
      Deseja realmente excluir o grupo <b>${name}</b> da categoria ${category.name}? Todos registros de gastos contidos nele serão <b>perdidos!</b>`
    
    result.then((res: boolean) => res && 
      this.groupService.delete(id).subscribe(() => {
        this.toastr.success('Excluído com sucesso!')
        
        this.listGroups()
      })
    )
  }
}
