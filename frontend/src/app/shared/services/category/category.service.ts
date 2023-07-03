import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CategoryDTO from 'src/app/shared/DTOs/category';
import { environment } from 'src/environments/environment';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import CategoryForm from '../../classes/CategoryForm';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseRoute = 'categories'

  constructor(private http: HttpClient) {}

  list({ month='' }) {
    return this.http.get<Res<CategoryDTO[]>>(`${environment.apiUrl}/${this.baseRoute}?month=${month}`)
  }

  get(id: string) {
    return this.http.get<Res<CategoryDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: CategoryForm) {
    return this.http.post<Res<CategoryDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: CategoryForm) {
    return this.http.put<Res<CategoryDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string) {
    return this.http.delete<Res<CategoryDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
}
