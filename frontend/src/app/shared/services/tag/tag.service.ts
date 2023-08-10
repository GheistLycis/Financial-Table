import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Response as Res } from '@interfaces/Response';
import TagDTO from '@DTOs/tag';
import TagForm from '../../classes/TagForm';
import ExpenseDTO from '../../DTOs/expense';
import { queryMaker } from '../queryMaker';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  baseRoute = 'tags'

  constructor(private http: HttpClient) {}

  list(query?: { expense?: ExpenseDTO['id'] }) {
    return this.http.get<Res<TagDTO[]>>(`${environment.apiUrl}/${this.baseRoute}?${queryMaker(query)}`)
  }

  get(id: TagDTO['id']) {
    return this.http.get<Res<TagDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: TagForm) {
    return this.http.post<Res<TagDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: number, payload: TagForm) {
    return this.http.put<Res<TagDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: number) {
    return this.http.delete<Res<TagDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
}
