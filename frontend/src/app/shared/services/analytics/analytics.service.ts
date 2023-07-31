import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import { environment } from 'src/environments/environment';
import YearHistory from '../../interfaces/YearHistory';
import CategoryRemaining from '../../interfaces/CategoryRemaining';
import MonthHistory from '../../interfaces/MonthHistory';
import MonthDTO from '../../DTOs/month';
import YearDTO from '../../DTOs/year';
import CategoryDTO from '../../DTOs/category';
import CategoryChartData from '../../interfaces/CategoryChartData';
import { queryMaker } from '../queryMaker';
import TagChartData from '../../interfaces/TagChartData';
import ExpenseChartData from '../../interfaces/ExpenseChartData';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  baseRoute = 'analytics'

  constructor(private http: HttpClient) {}

  categoryRemaining(category: CategoryDTO['id']) {
    return this.http.get<Res<CategoryRemaining>>(`${environment.apiUrl}/${this.baseRoute}/category-remaining/${category}`)
  }
  
  monthBalance(month: MonthDTO['id']) {
    return this.http.get<Res<{ month: MonthDTO, balance: number }>>(`${environment.apiUrl}/${this.baseRoute}/month-balance/${month}`)
  }
  
  mostExpensiveCategory(month: MonthDTO['id']) {
    return this.http.get<Res<{ name: string, total: number }>>(`${environment.apiUrl}/${this.baseRoute}/most-expensive-category/${month}`)
  }
  
  mostExpensiveTags(month: MonthDTO['id']) {
    return this.http.get<Res<{ name: string, total: number }>>(`${environment.apiUrl}/${this.baseRoute}/most-expensive-tags/${month}`)
  }
  
  monthHistory(month: MonthDTO['id']) {
    return this.http.get<Res<Omit<MonthHistory, 'balance'>>>(`${environment.apiUrl}/${this.baseRoute}/month-history/${month}`)
  }
  
  recentExpenses(month: MonthDTO['id']) {
    return this.http.get<Res<number | '--'>>(`${environment.apiUrl}/${this.baseRoute}/recent-expenses/${month}`)
  }
  
  yearExpenses(month: MonthDTO['id']) {
    return this.http.get<Res<number | '--'>>(`${environment.apiUrl}/${this.baseRoute}/year-expenses/${month}`)
  }
  
  yearHistory(year: YearDTO['id']) {
    return this.http.get<Res<YearHistory>>(`${environment.apiUrl}/${this.baseRoute}/year-history/${year}`)
  }

  categoryChart(months: MonthDTO['id'][]) {
    return this.http.post<Res<CategoryChartData>>(`${environment.apiUrl}/${this.baseRoute}/category-chart`, months)
  }

  tagChart(months: MonthDTO['id'][]) {
    return this.http.post<Res<TagChartData>>(`${environment.apiUrl}/${this.baseRoute}/tag-chart`, months)
  }

  expenseChart(months: MonthDTO['id'][]) {
    return this.http.post<Res<ExpenseChartData>>(`${environment.apiUrl}/${this.baseRoute}/expense-chart`, months)
  }
}
