import { SortOrder } from "../enums/SortOrder"

export interface SortEvent<T = string> {
    column: T
    order: keyof typeof SortOrder
}
