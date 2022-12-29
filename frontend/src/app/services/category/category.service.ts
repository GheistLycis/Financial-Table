import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import CategoryDTO from 'src/app/DTOs/category';
import { env } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseRoute = 'categories'

  constructor(private http: HttpClient) {}

  list(month: string = ''): Observable<any>{
    return this.http.get(`${env.api}/${this.baseRoute}?month=${month}`)
  }

  get(id: string): Observable<any>{
    return this.http.get(`${env.api}/${this.baseRoute}/${id}`)
  }

  post(payload: CategoryDTO): Observable<any>{
    return this.http.post(`${env.api}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: CategoryDTO): Observable<any>{
    return this.http.put(`${env.api}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string): Observable<any>{
    return this.http.delete(`${env.api}/${this.baseRoute}/${id}`)
  }
}
