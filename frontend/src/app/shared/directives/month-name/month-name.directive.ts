import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { monthNames } from 'src/app/shared/enums/monthNames';

@Directive({
  selector: '[appMonthName]'
})
export class MonthNameDirective implements OnChanges {
  @Input() appMonthName!: string | number

  constructor(private el: ElementRef) { }

  ngOnChanges(): void {
    this.el.nativeElement.innerText = this.convert(this.appMonthName)
  }
  
  public convert(monthNum: string | number): string {
    let name = 'mês'

    for(const monthName in monthNames) if(monthNames[monthName] == monthNum) name = monthName
    
    return name
  } 
}
