import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TagService } from 'src/app/shared/services/tag/tag.service';
import { AddEditTagComponent } from './components/add-edit-tag/add-edit-tag.component';
import { GeneralWarningComponent } from 'src/app/shared/components/modals/general-warning/general-warning.component';
import TagDTO from 'src/app/shared/DTOs/tag';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  tags: TagDTO[] = []
  
  constructor(
    private tagService: TagService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) { }
  
  ngOnInit(): void {
    this.listTags()
  }
  
  listTags(): void {
    this.tagService.list().subscribe(({ data }) => this.tags = data)
  }
  
  addTag(): void {
    const { result } = this.modalService.open(AddEditTagComponent, { size: 'lg' })
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Criado com sucesso!')
        
        this.listTags()
      }
    })
  }
  
  editTag(tag: TagDTO): void {
    const { componentInstance, result } = this.modalService.open(AddEditTagComponent, { size: 'lg' })
    
    componentInstance.tag = tag
    
    result.then((res: boolean) => {
      if(res) {
        this.toastr.success('Editado com sucesso!')
        
        this.listTags()
      }
    })
  }
  
  deleteTag({ id, name }: TagDTO) {
    const { componentInstance, result } = this.modalService.open(GeneralWarningComponent, { size: 'md' })
    
    componentInstance.title = 'Excluir tag'
    componentInstance.text = `Deseja realmente excluir a tag <b>${name}</b>?`
    
    result.then((res: boolean) => res && 
      this.tagService.delete(id).subscribe(() => {
        this.toastr.success('Excluído com sucesso!')
        
        this.listTags()
      })
    )
  }
}
