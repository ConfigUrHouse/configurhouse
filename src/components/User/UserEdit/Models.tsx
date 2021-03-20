import { RouteComponentProps } from "react-router-dom";
import { ApiResponseError } from "../../../api/models";
import { Role } from "../Models";

export interface UserPathParams {
  id: string;
}

export type UserEditProps = RouteComponentProps<UserPathParams>;

export interface UserEditState {
  id: number;
  availableRoles: Role[];
  formValues: FormValues;
  error?: ApiResponseError;
}

export interface FormValues {
  firstname: string;
  lastname: string;
  email: string;
  verified: boolean;
  roles: number[];
}
