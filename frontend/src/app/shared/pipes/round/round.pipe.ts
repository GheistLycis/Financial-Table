import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {
  transform(value: number | string, format: 'floor' | 'ceil' | number = 'floor'): number {
    if(format == 'floor') {
      return Math.floor(Number(value))
    }
    else if(format == 'ceil') {
      return Math.ceil(Number(value))
    }
    else {
      const scaleIndex = `${value}`.indexOf('.') + 1 + format
      
      return Number(`${value}`.substring(0, scaleIndex))
    }
  }
}
