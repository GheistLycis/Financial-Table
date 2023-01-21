import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response as Res } from 'src/app/utils/interfaces/response';
import { env } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  baseRoute = 'analytics'

  constructor(private http: HttpClient) {}

  recentExpenses() {
    return this.http.get<Res<number>>(`${env.api}/${this.baseRoute}/recent-expenses`)
  }
}
