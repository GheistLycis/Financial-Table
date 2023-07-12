import { Pipe, PipeTransform } from '@angular/core';

type acceptedOutputFormats = 'clock' | 'days' | 'full'

@Pipe({
  name: 'timeLeft'
})
export class TimeLeftPipe implements PipeTransform {
  transform(value: string | Date, outputFormat: acceptedOutputFormats = 'full', live = false): string {
    const targetDate = new Date(value)
    const today = new Date()
    let finalValue: string
    
    const timeLeft = targetDate.getTime() - today.getTime()
    
    if(outputFormat == 'days') {
      finalValue = Math.floor(timeLeft / 1000 / 60 / 60 / 24) + ' dias'
    }
    else if(outputFormat == 'full') {
      let days = 0, months = 0, years = 0
      
      days = timeLeft / 1000 / 60 / 60 / 24
      
      if(days >= 30) {
        months = days / 30
        days = Math.floor((months - Math.floor(months)) * 30)
        
        if(months >= 12) {
          years = months / 12
          months = Math.floor((years - Math.floor(years)) * 12)
          years = Math.floor(years)
          
          finalValue = 
            `${years} ${years > 1 ? 'anos' : 'ano'}` +
            `, ${months} ${months > 1 ? 'meses' : 'mês'}` +
            ` e ${days} ${days > 1 ? 'dias' : 'dia'}`
        }
        else {
          months = Math.floor(months)
          
          finalValue = 
          `${months} ${months > 1 ? 'meses' : 'mês'}` +
          ` e ${days} ${days > 1 ? 'dias' : 'dia'}`
        }
      }
      else {
        days = Math.floor(days)
        
        finalValue = days + ' dias'
      }
    }
    
    return finalValue
  }
}
