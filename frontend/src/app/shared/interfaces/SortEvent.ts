import { SortOrder } from "../enums/SortOrder"

export interface SortEvent {
    column: string
    order: keyof typeof SortOrder
}
