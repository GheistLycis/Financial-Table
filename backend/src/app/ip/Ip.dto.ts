import BaseDTO from "@interfaces/BaseDTO";
import UserDTO from "../user/User.dto";

export default interface IpDTO extends Omit<BaseDTO, 'id'> {
  ip: string
  active: boolean
  users: UserDTO[]
}