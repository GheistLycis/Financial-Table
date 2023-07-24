import { Directive, ElementRef, EventEmitter, Input, Output } from "@angular/core";
import { SortOrder } from "../../enums/SortOrder";
import { SortEvent } from "../../interfaces/SortEvent";


@Directive({
  selector: '[appSortableTable]',
})
export class SortableTableDirective {
  @Input() set init(signal: boolean) {
    this._init()
  }
  @Output() sort = new EventEmitter<SortEvent>()
  table!: HTMLTableElement
  headers!: NodeListOf<HTMLTableCellElement>

  constructor(private element: ElementRef<HTMLTableElement>) {
    this.table = element.nativeElement
  }

  _init() {
    this.headers = this.table.querySelectorAll('th[sortable]')

    this.headers.forEach((header, i) => {
      header.classList.add('pointer')
      header.setAttribute('order', '')
      header.onclick = this.nextOrder.bind(this, header, i)
    })
  }
  
  nextOrder(header: HTMLTableCellElement, index: number): void {
    const column = header.getAttribute('sortable')
    const oldOrder = header.getAttribute('order')

    header.setAttribute('order', SortOrder[oldOrder])

    this.headers.forEach((header, i) => {
      if(i != index) header.setAttribute('order', '')
    })

    this.sort.emit({ column, order: header.getAttribute('order') as keyof typeof SortOrder })
  }
}
