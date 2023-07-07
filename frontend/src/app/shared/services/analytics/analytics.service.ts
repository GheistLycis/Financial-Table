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
  
  monthHistory(month: MonthDTO['id']) {
    return this.http.get<Res<Omit<MonthHistory, 'balance'>>>(`${environment.apiUrl}/${this.baseRoute}/month-history/${month}`)
  }
  
  recentExpenses(month: MonthDTO['id']) {
    return this.http.get<Res<number | '--'>>(`${environment.apiUrl}/${this.baseRoute}/recent-expenses/${month}`)
  }
  
  yearHistory(year: YearDTO['id']) {
    return this.http.get<Res<YearHistory>>(`${environment.apiUrl}/${this.baseRoute}/year-history/${year}`)
  }
}
