import CategoryDTO from "../DTOs/category"

export default class GroupForm {
  name: string
  color: string
  category: CategoryDTO['id']
}