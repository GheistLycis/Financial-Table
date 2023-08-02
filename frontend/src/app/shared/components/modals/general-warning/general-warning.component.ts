import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-general-warning',
  templateUrl: './general-warning.component.html',
  styleUrls: ['./general-warning.component.scss']
})
export class GeneralWarningComponent {
  @Input() title!: string
  @Input() text!: string
  @Input() showWarningIcon = true
  @Input() showCancelButton = true
  @Input() showConfirmButton = true
  @Input() cancelButtonText = 'Não'
  @Input() confirmButtonText = 'Sim'
  
  constructor(
    protected activeModal: NgbActiveModal,
  ) { }
}
