export interface PaginationFilters {
    page?: number;
    limit?: number;
}

export interface ListedResponseMetadata {
    currentPage: number;
    itemCount: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export interface ListedResponse<T> {
    items: T[];
    meta: ListedResponseMetadata;
}
