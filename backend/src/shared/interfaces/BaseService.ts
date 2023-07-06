import { Request } from "express"

export default interface BaseService<EntityDTO> {
  list(query?: any, req?: Request): Promise<EntityDTO[]>
  get(getter: number | string): Promise<EntityDTO>
  post(body: any): Promise<EntityDTO>
  put(id: number, body: any): Promise<EntityDTO>
  delete(id: number): Promise<EntityDTO>
}