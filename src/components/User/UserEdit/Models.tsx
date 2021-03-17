import { RouteComponentProps } from "react-router-dom"
import { User, Role } from "../Models"

export interface UserPathParams {
    id: string,
}

export type UserEditProps = RouteComponentProps<UserPathParams> & {}

export interface UserEditState {
    id: number;
    availableRoles: Role[];
    user?: User;
    roles: number[];
}