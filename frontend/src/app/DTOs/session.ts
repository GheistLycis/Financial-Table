import UserDTO from "./user"

export default interface Session { 
  user: UserDTO
  token: string 
}