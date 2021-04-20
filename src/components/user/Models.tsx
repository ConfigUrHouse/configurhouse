export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  active: number;
}

export interface Role {
  id: number;
  name: string;
}

export interface UserRole {
  id: number;
  id_User: number;
}
