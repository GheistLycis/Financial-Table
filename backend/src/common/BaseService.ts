import { Repository } from "typeorm";

export interface BaseService<Entity, EntityDTO> {
  repo: Repository<Entity>

  list(query?: any): Promise<EntityDTO[]>
  get(id: string): Promise<EntityDTO>
  post(body: any): Promise<EntityDTO>
  put(id: string, body: any): Promise<EntityDTO>
  delete(id: string): Promise<EntityDTO>
}