export interface UsersState {
  users: User[];
  firstName: string;
  lastName: string;
  id: string;
  type: string;
  currentPage: number;
  totalPages: number;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  active: number;
}
