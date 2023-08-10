import { Pipe, PipeTransform } from '@angular/core';
import { MonthNames } from '../../enums/MonthNames';

@Pipe({ 
  name: 'monthName', 
  standalone: true ,
})
export class MonthNamePipe implements PipeTransform {
  transform(value: number): string {
    let name = 'mês'

    for(const monthName in MonthNames) if(MonthNames[monthName] == `${value}`) name = monthName
    
    return name
  }
}