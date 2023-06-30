import CategoryDTO from "../DTOs/category"

export default interface CategoryRemaining {
  category: CategoryDTO, 
  originalAvailable: number,
  remaining: number,
}