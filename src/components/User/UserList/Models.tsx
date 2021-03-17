import { RouteComponentProps } from 'react-router-dom';
import { PaginatedResponse } from '../../../utils/pagination';
import { Role, User } from '../Models';

export interface UsersListState {
  formValues: FormValues;
  paginatedItems: PaginatedResponse<User>;
  roles: Role[]
}

export interface FormValues {
  firstName: string;
  lastName: string;
  role: string;
}

export interface UserListPathParams {
  id: string,
}

export type UserListProps = RouteComponentProps<UserListPathParams> & {}
