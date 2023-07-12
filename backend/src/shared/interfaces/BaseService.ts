export default interface BaseService<EntityDTO> {
  list(...args: unknown[]): Promise<EntityDTO[]>
  get(...args: unknown[]): Promise<EntityDTO>
  post(...args: unknown[]): Promise<EntityDTO>
  put(...args: unknown[]): Promise<EntityDTO>
  delete(...args: unknown[]): Promise<EntityDTO>
}