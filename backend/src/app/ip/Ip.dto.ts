import BaseDTO from "src/shared/BaseDTO";

export default interface IpDTO extends BaseDTO {
  ip: string
  active: boolean
}