import UserDTO from "src/app/user/User.dto";

export default interface Session { 
  user: UserDTO
  token: string 
}