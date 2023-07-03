import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import GroupDTO from 'src/app/shared/DTOs/group';
import { environment } from 'src/environments/environment';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import GroupForm from '../../classes/GroupForm';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  baseRoute = 'groups'

  constructor(private http: HttpClient) {}

  list({ month='', category='' }) {
    return this.http.get<Res<GroupDTO[]>>(`${environment.apiUrl}/${this.baseRoute}?month=${month}&category=${category}`)
  }

  get(id: string) {
    return this.http.get<Res<GroupDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: GroupForm) {
    return this.http.post<Res<GroupDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: GroupForm) {
    return this.http.put<Res<GroupDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string) {
    return this.http.delete<Res<GroupDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
}
