export interface PaginatedResponse<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export function emptyPaginatedData<T>() {
  const paginatedResponse: PaginatedResponse<T> = {
    items: [],
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
  };

  return paginatedResponse;
}
