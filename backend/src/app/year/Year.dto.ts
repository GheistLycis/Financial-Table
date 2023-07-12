import BaseDTO from "src/shared/interfaces/BaseDTO";
import UserDTO from "../user/User.dto";

export default interface YearDTO extends BaseDTO {
  year: number
  user: UserDTO
}