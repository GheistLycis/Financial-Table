import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import GroupDTO from 'src/app/shared/DTOs/group';
import { environment } from 'src/environments/environment';
import { Response as Res } from 'src/app/shared/interfaces/Response';
import GroupForm from '../../classes/GroupForm';
import { queryMaker } from '../queryMaker';
import MonthDTO from '../../DTOs/month';
import CategoryDTO from '../../DTOs/category';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  baseRoute = 'groups'

  constructor(private http: HttpClient) {}

  list(query: { month?: MonthDTO['id'], category?: CategoryDTO['id'] }) {
    return this.http.get<Res<GroupDTO[]>>(`${environment.apiUrl}/${this.baseRoute}?${queryMaker(query)}`)
  }

  get(id: number) {
    return this.http.get<Res<GroupDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }

  post(payload: GroupForm) {
    return this.http.post<Res<GroupDTO>>(`${environment.apiUrl}/${this.baseRoute}`, payload)
  }

  put(id: number, payload: GroupForm) {
    return this.http.put<Res<GroupDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: number) {
    return this.http.delete<Res<GroupDTO>>(`${environment.apiUrl}/${this.baseRoute}/${id}`)
  }
}
