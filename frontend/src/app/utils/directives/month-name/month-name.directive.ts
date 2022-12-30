import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appMonthName]'
})
export class MonthNameDirective implements OnChanges {
  @Input() appMonthName!: number
  months = {
    Janeiro: 1,
    Fevereiro: 2,
    Março: 3,
    Abril: 4,
    Maio: 5,
    Junho: 6,
    Julho: 7,
    Agosto: 8,
    Setembro: 9,
    Outubro: 10,
    Novembro: 11,
    Dezembro: 12,
  }

  constructor(private el: ElementRef) { }

  ngOnChanges(): void {
    let monthName = 'mês'

    for(let month in this.months) if(this.months[month] == this.appMonthName) monthName = month

    this.el.nativeElement.innerText = monthName
  }
}
