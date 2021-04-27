import { RouteComponentProps } from "react-router-dom";
import { ApiResponseError } from "../../../api/models";
import { Configuration } from "../../../models";

export interface UserConfigurationEditState {
  item: Configuration;
  error?: ApiResponseError;
}

export interface UserConfigurationPathParams {
  id: string;
}

export type UserConfigurationEditProps = RouteComponentProps<UserConfigurationPathParams>;
