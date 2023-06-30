import CategoryDTO from "src/app/category/Category.dto"

export default interface CategoryRemaining {
  category: CategoryDTO, 
  originalAvailable: number,
  remaining: number,
}