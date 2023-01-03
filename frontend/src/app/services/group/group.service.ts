import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import GroupDTO from 'src/app/DTOs/group';
import { env } from 'src/environment';
import { Response as Res } from 'src/app/utils/interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  baseRoute = 'groups'

  constructor(private http: HttpClient) {}

  list({ month='', category='' }) {
    return this.http.get<Res<GroupDTO[]>>(`${env.api}/${this.baseRoute}?month=${month}&category=${category}`)
  }

  get(id: string) {
    return this.http.get<Res<GroupDTO>>(`${env.api}/${this.baseRoute}/${id}`)
  }

  post(payload: GroupDTO) {
    return this.http.post<Res<GroupDTO>>(`${env.api}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: GroupDTO) {
    return this.http.put<Res<GroupDTO>>(`${env.api}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string) {
    return this.http.delete<Res<GroupDTO>>(`${env.api}/${this.baseRoute}/${id}`)
  }
}
