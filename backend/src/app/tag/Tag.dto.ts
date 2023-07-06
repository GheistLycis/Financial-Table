import BaseDTO from "src/shared/interfaces/BaseDTO";

export default interface TagDTO extends BaseDTO {
  name: string
  color: string
}