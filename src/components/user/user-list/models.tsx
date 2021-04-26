import { RouteComponentProps } from "react-router-dom";
import { ApiResponseError } from "../../../api/models";
import { PaginatedResponse } from "../../../utils/pagination";
import { Role, User } from "../../../models";

export interface UsersListState {
  formValues: FormValues;
  paginatedItems: PaginatedResponse<User>;
  roles: Role[];
  showEmailModal: boolean;
  selectedUsers: User[];
  error?: ApiResponseError;
}

export interface FormValues {
  firstName: string;
  lastName: string;
  role: string;
}

export interface UserListPathParams {
  id: string;
}

export type UserListProps = RouteComponentProps<UserListPathParams>;
