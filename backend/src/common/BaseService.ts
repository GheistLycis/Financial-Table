import { Repository } from "typeorm";

export interface BaseService<Entity, EntityDTO> {
  list(query?: any): Promise<EntityDTO[]>
  get(id: string): Promise<EntityDTO>
  post(body: any): Promise<EntityDTO>
  put(id: string, body: any): Promise<EntityDTO>
  delete(id: string): Promise<EntityDTO>
}