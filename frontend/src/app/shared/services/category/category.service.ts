import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CategoryDTO from 'src/app/shared/DTOs/category';
import { environment } from 'src/environments/environment';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import CategoryForm from '../../classes/CategoryForm';
import { queryMaker } from '../queryMaker';
import MonthDTO from '../../DTOs/month';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseRoute = 'categories'

  constructor(private http: HttpClient) {}

  list(query: { month?: MonthDTO['id'] }) {
    return this.http.get<Res<CategoryDTO[]>>(`${environment.apiUrl}/${this.baseRoute}?${queryMaker(query)}`)
  }

  get(id: number) {
    return this.http.get<Res<CategoryDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: CategoryForm) {
    return this.http.post<Res<CategoryDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: number, payload: CategoryForm) {
    return this.http.put<Res<CategoryDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: number) {
    return this.http.delete<Res<CategoryDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
}
