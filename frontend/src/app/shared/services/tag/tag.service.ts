import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import TagDTO from 'src/app/shared/DTOs/tag';
import TagForm from '../../classes/TagForm';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  baseRoute = 'tags'

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Res<TagDTO[]>>(`${environment.apiUrl}/${this.baseRoute}`)
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
