import { SortOrder } from "../enums/SortOrder"

export interface SortEvent<T = any> {
    column: T
    order: keyof typeof SortOrder
}
