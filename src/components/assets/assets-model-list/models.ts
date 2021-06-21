import { RouteComponentProps } from "react-router";
import { ApiResponseError } from "../../../api/models";
import { Asset } from "../../../models";
import { PaginatedResponse } from "../../../utils/pagination";

export interface AssetState {
  paginatedItems: PaginatedResponse<Asset>;
  error?: ApiResponseError;
}

export interface AssetPathParams {}

export type AssetProps = RouteComponentProps<AssetPathParams>;
