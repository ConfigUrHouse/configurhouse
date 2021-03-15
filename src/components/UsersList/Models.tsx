import { PaginatedResponse } from '../../utils/pagination';

export interface UsersState {
  formValues: FormValues;
  paginatedItems: PaginatedResponse<User>;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  active: number;
}

export interface FormValues {
  firstName: string;
  lastName: string;
  role: string;
}
