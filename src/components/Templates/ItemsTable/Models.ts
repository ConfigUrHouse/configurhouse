import { IconProp } from "@fortawesome/fontawesome-svg-core";
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
  globalActions?: {
    actions: {
      icon: IconProp;
      handle(selectedItems: T[]): void;
    }[];
    fetchAll(): Promise<T[]>;
  };
}

export interface ItemsTableState<T extends Record<string, any>> {
  selectedItems: T[];
  itemToDelete: T | null;
}
