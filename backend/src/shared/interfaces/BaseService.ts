import { Request } from "express"

export default interface BaseService<EntityDTO> {
  list(...query: any): Promise<EntityDTO[]>
  get(id: number): Promise<EntityDTO>
  post(body: any): Promise<EntityDTO>
  put(id: number, body: any): Promise<EntityDTO>
  delete(id: number): Promise<EntityDTO>
}