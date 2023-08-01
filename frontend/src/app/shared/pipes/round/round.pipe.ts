import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {
  transform(value: number | string, format: 'floor' | 'ceil' | number = 'floor'): string {
    if(format == 'floor') {
      return Math.floor(Number(value)).toString()
    }
    else if(format == 'ceil') {
      return Math.ceil(Number(value)).toString()
    }
    else {
      const round = 10 ** format
      const roundedNumParts = (Math.round(round * Number(value)) / round)
        .toString()
        .split('.')

      if(roundedNumParts?.[1]) {
        roundedNumParts[1] = roundedNumParts[1].padEnd(format, '0')
      }
      else {
        roundedNumParts.push([...Array(format).fill(0)].join(''))
      }

      return roundedNumParts.join(',')
    }
  }
}
