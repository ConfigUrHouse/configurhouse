import { RouteComponentProps } from "react-router-dom";
import { ApiResponseError } from "../../../api/models";

export type EstimateProps = RouteComponentProps<{ id?: string }>;

export interface EstimateState {
  error?: ApiResponseError;
  data?: any;
}
