import { Pipe, PipeTransform } from '@angular/core';
import { monthNames } from '../../enums/monthNames';

@Pipe({name: 'monthName'})
export class MonthNamePipe implements PipeTransform {
  transform(value: number): string {
    let name = 'mês'

    for(const monthName in monthNames) if(monthNames[monthName] == `${value}`) name = monthName
    
    return name
  }
}