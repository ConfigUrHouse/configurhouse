import { PaginatedResponse } from "../../../utils/pagination";

export interface ItemsTableColumn<T extends Record<string, any>> {
  name: string;
  displayName: string;
  component?(item: T): JSX.Element | string;
}

export interface ItemsTableProps<T extends Record<string, any>> {
  paginatedItems: PaginatedResponse<T>;
  columns: ItemsTableColumn<T>[];
  handlePageChange(page: number): void;
  handleEdit?(id: number): void;
  handleDelete?(id: number): void;
  deleteMessage?(item: T): string;
}

export interface ItemsTableState<T extends Record<string, any>> {
  itemToDelete: T | null;
}
