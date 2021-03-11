export interface UsersState {
  formValues: FormValues;
  users: User[];
  currentPage: number;
  totalPages: number;
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
  type: string;
}
