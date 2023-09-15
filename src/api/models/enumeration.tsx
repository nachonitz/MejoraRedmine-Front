import { PaginationFilters } from "./common";

interface BaseEnumeration {
    name: string;
    position: number;
    type: string;
    active: boolean;
}

export interface Enumeration extends BaseEnumeration {
    id: number;
}

type AscDesc = "asc" | "desc";
type FilterOrder = `${keyof Enumeration}:${AscDesc}`;

export interface EnumerationFilter extends PaginationFilters {
    type?: string;
    order?: FilterOrder;
}

export enum EnumerationType {
    PRIORITY = "IssuePriority",
    DOCUMENT_CATEGORY = "DocumentCategory",
    TIME_ENTRY_ACTIVITY = "TimeEntryActivity",
}
