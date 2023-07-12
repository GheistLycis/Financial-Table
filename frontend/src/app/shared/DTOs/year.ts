import BaseDTO from "../interfaces/BaseDTO";
import UserDTO from "./user";

export default interface YearDTO extends BaseDTO {
  year: number
  user: UserDTO
}