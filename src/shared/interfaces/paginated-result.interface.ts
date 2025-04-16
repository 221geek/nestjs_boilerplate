export interface PaginationMeta {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
}

export interface PaginatedResult<T> {
	data: T[];
	meta: PaginationMeta;
}
