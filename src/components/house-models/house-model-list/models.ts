import { RouteComponentProps } from "react-router";
import { ApiResponseError } from "../../../api/models";
import { HouseModel } from "../../../models";
import { PaginatedResponse } from "../../../utils/pagination";

export interface HouseModelsState {
  paginatedItems: PaginatedResponse<HouseModel>;
  error?: ApiResponseError;
}

export interface HouseModelsPathParams {}

export type HouseModelsProps = RouteComponentProps<HouseModelsPathParams>;
