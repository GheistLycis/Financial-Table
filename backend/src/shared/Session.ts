import UserDTO from "src/app/user/User.dto";

export interface Session { 
  user: UserDTO
  token: string 
}