import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'timeLeft'
})
export class TimeLeftPipe implements PipeTransform {
  transform(value: string | Date, outputFormat: 'full' | 'days' = 'full'): string {
    const targetDate = new Date(value)
    const today = new Date()
    const timeLeft = targetDate.getTime() - today.getTime()
    
    if(outputFormat == 'days') {
      return `${Math.ceil(timeLeft / 1000 / 60 / 60 / 24)} dias`
    }
    else {
      let days = 0, months = 0, years = 0
      
      days = timeLeft / 1000 / 60 / 60 / 24
      
      if(days >= 30) {
        months = days / 30
        days = Math.ceil((months - Math.floor(months)) * 30)
        
        if(months >= 12) {
          years = months / 12
          months = Math.floor((years - Math.floor(years)) * 12)
          years = Math.floor(years)
          
          return (
            `${years} ${years > 1 ? 'anos' : 'ano'}` +
            `, ${months} ${months > 1 ? 'meses' : 'mês'}` +
            ` e ${days} ${days > 1 ? 'dias' : 'dia'}`
          )
        }
        else {
          months = Math.floor(months)
          
          return (
            `${months} ${months > 1 ? 'meses' : 'mês'}` +
            ` e ${days} ${days > 1 ? 'dias' : 'dia'}`
          )
        }
      }
      else {
        days = Math.ceil(days)
        
        return `${days} ${days > 1 ? 'dias' : 'dia'}`
      }
    }
  }
}
