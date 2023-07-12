import BaseDTO from "../interfaces/BaseDTO";
import UserDTO from "./user";

export default interface TagDTO extends BaseDTO {
  name: string
  color: string
  user: UserDTO
}