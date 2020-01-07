export interface IPaginatedItems {
	itemsPerPage: number;
	pageNumber: number;
	sort?: Record<string, any>;
	fields?: Record<string, any>;
}
