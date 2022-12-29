import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import GroupDTO from 'src/app/DTOs/group';
import { env } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  baseRoute = 'groups'

  constructor(private http: HttpClient) {}

  list(category: string = ''): Observable<any>{
    return this.http.get(`${env.api}/${this.baseRoute}?category=${category}`)
  }

  get(id: string): Observable<any>{
    return this.http.get(`${env.api}/${this.baseRoute}/${id}`)
  }

  post(payload: GroupDTO): Observable<any>{
    return this.http.post(`${env.api}/${this.baseRoute}`, payload)
  }

  put(id: string, payload: GroupDTO): Observable<any>{
    return this.http.put(`${env.api}/${this.baseRoute}/${id}`, payload)
  }

  delete(id: string): Observable<any>{
    return this.http.delete(`${env.api}/${this.baseRoute}/${id}`)
  }
}
