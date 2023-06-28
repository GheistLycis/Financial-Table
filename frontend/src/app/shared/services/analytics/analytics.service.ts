import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import { environment } from 'src/environments/environment';
import YearHistory from '../../interfaces/YearHistory';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  baseRoute = 'analytics'

  constructor(private http: HttpClient) {}

  yearHistory(year: string) {
    return this.http.get<Res<YearHistory>>(`${environment.apiUrl}/${this.baseRoute}/year-history/${year}`)
  }
}
