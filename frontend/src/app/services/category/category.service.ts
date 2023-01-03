import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CategoryDTO from 'src/app/DTOs/category';
import { env } from 'src/environment';
import { Response as Res } from 'src/app/utils/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseRoute = 'categories'

  constructor(private http: HttpClient) {}

  list({ month='' }) {
    return this.http.get<Res<CategoryDTO[]>>(`${env.api}/${this.baseRoute}?month=${month}`)
  }

  get(id: string) {
    return this.http.get<Res<CategoryDTO>>(`${env.api}/${this.baseRoute}/${id}`)
  }

  post(payload: CategoryDTO) {
    return this.http.post<Res<CategoryDTO>>(`${env.api}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: CategoryDTO) {
    return this.http.put<Res<CategoryDTO>>(`${env.api}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string) {
    return this.http.delete<Res<CategoryDTO>>(`${env.api}/${this.baseRoute}/${id}`)
  }
}
