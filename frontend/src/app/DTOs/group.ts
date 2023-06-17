import BaseDTO from "../utils/interfaces/BaseDTO";
import CategoryDTO from "./category";

export default interface GroupDTO extends BaseDTO {
  name: string
  color: string
  category: CategoryDTO
}