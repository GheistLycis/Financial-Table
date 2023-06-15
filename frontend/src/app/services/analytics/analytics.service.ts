import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response as Res } from 'src/app/utils/interfaces/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  baseRoute = 'analytics'

  constructor(private http: HttpClient) {}

  recentExpenses() {
    return this.http.get<Res<number>>(`${environment.apiUrl}/${this.baseRoute}/recent-expenses`)
  }
}
