import { Directive, EventEmitter, Input, Output } from "@angular/core";

export type SortOrder = 'ASC' | 'DESC' | ''

enum sortRoration {
  ASC = 'DESC',
  DESC = '',
  '' = 'ASC',
}

export interface SortEvent {
  sortable: string
  order: SortOrder
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class]': "order",
    '(click)': 'rotate()',
  },
})
export class SortableHeaderDirective {
  @Input() sortable: string
  @Output() sort = new EventEmitter<SortEvent>()
  order: SortOrder = ''

  rotate(): void {
    this.order = rotate[this.order]
    this.sort.emit({ sortable: this.sortable, order: this.order })
  }
}
