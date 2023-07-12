import { User } from "src/app/user/User"

export default interface BaseService<EntityDTO> {
  list(userId: User['id'], ...args: unknown[]): Promise<EntityDTO[]>
  get(userId: User['id'], ...args: unknown[]): Promise<EntityDTO>
  post(userId: User['id'], ...args: unknown[]): Promise<EntityDTO>
  put(userId: User['id'], ...args: unknown[]): Promise<EntityDTO>
  delete(userId: User['id'], ...args: unknown[]): Promise<EntityDTO>
}