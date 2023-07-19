import { Component } from '@angular/core';
import MonthlyExpenseDTO from 'src/app/shared/DTOs/monthlyExpense';
import MonthlyIncomeDTO from 'src/app/shared/DTOs/monthlyIncome';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  monthlyIncomes: Partial<MonthlyIncomeDTO>[] = [
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    // { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
  ]
  monthlyExpenses: Partial<MonthlyExpenseDTO>[] = [
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
    { value: 90.30, date: new Date('2025-07-29'), description: 'teste' },
  ]
}
