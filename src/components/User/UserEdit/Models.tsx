import { RouteComponentProps } from "react-router-dom"

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

export interface UserPathParams {
    id: string,
}

export type UserProps = RouteComponentProps<UserPathParams> & {}