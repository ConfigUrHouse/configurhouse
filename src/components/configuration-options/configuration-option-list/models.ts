import { RouteComponentProps } from "react-router";
import { ApiResponseError } from "../../../api/models";
import { ConfigurationOption } from "../../../models";
import { PaginatedResponse } from "../../../utils/pagination";

export interface ConfigurationOptionListState {
  paginatedItems: PaginatedResponse<ConfigurationOption>;
  error?: ApiResponseError;
}

export interface ConfigurationOptionListPathParams {}

export type ConfigurationOptionListProps =
  RouteComponentProps<ConfigurationOptionListPathParams>;
