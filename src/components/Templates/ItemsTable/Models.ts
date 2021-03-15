import { PaginatedResponse } from '../../../utils/pagination';

export interface ItemsTableColumn {
  name: string;
  displayName: string;
  component?(item: any): JSX.Element;
}

export interface ItemsTableProps<T> {
  paginatedItems: PaginatedResponse<T>;
  columns: ItemsTableColumn[];
  handlePageChange(page: number): void;
  handleEdit?(id: number): void;
  handleDelete?(id: number): void;
}
