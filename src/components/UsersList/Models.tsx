import { User } from "../../models";
import { PaginatedResponse } from "../../utils/pagination";

export interface UsersState {
  formValues: FormValues;
  paginatedItems: PaginatedResponse<User>;
}

export interface FormValues {
  firstName: string;
  lastName: string;
  role: string;
}
