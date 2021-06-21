import { RouteComponentProps } from "react-router";
import { ApiResponseError } from "../../api/models";
import { Role } from "../../models";
import { PaginatedResponse } from "../../utils/pagination";

export interface RoleListState {
  paginatedItems: PaginatedResponse<Role>;
  error?: ApiResponseError;
}

export interface RolePathParams {}

export type RoleListProps = RouteComponentProps<RolePathParams>;
