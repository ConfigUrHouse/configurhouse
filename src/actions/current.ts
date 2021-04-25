import { ThunkDispatch as Dispatch } from "redux-thunk";
import * as constants from "../constants";
import { ICurrent } from "../types";
export interface IAuthenticate {
  type: constants.AUTHENTICATE;
}
function authenticate(): IAuthenticate {
  return {
    type: constants.AUTHENTICATE,
  };
}
export interface IUnauthenticate {
  type: constants.UNAUTHENTICATE;
}
function unauthenticate(): IUnauthenticate {
  return {
    type: constants.UNAUTHENTICATE,
  };
}
export interface IAuthenticateAdmin {
  type: constants.AUTHENTICATEADMIN;
}
function authenticateAdmin() {
  return {
    type: constants.AUTHENTICATEADMIN,
  };
}

export type AuthenticationAction =
  | IAuthenticate
  | IUnauthenticate
  | IAuthenticateAdmin;
export function logIn(token: string, isAdmin: boolean) {
  return async (dispatch: Dispatch<AuthenticationAction, {}, any>) => {
    await window.localStorage.setItem("authenticated", "true");
    await window.localStorage.setItem("token", token);
    await window.localStorage.setItem("admin", isAdmin.toString());
    if (isAdmin) dispatch(authenticateAdmin());
    else dispatch(authenticate());
  };
}
export function logOut() {
  return async (dispatch: Dispatch<AuthenticationAction, {}, any>) => {
    await window.localStorage.setItem("token", "");
    await window.localStorage.setItem("authenticated", "false");
    await window.localStorage.setItem("admin", "false");
    dispatch(unauthenticate());
  };
}
export function checkAuthentication() {
  return async (dispatch: Dispatch<AuthenticationAction, {}, any>) => {
    const auth = await window.localStorage.getItem("authenticated");
    const formattedAuth = typeof auth === "string" ? JSON.parse(auth) : null;
    const isAdmin = await window.localStorage.getItem("admin");
    const formattedAdmin =
      typeof isAdmin === "string" ? JSON.parse(isAdmin) : null;
    if (formattedAdmin) {
      dispatch(authenticateAdmin());
    } else {
      formattedAuth ? dispatch(authenticate()) : dispatch(unauthenticate());
    }
  };
}
export function checkAdmin() {
  return async (dispatch: Dispatch<AuthenticationAction, {}, any>) => {
    const isAdmin = await window.localStorage.getItem("admin");

    const logged = await window.localStorage.getItem("authenticated");
    const formattedLogged =
      typeof logged === "string" ? JSON.parse(logged) : null;

    if (!formattedLogged) {
      dispatch(unauthenticate());
    } else {
      const formattedAdmin =
        typeof isAdmin === "string" ? JSON.parse(isAdmin) : null;

      formattedAdmin ? dispatch(authenticateAdmin()) : dispatch(authenticate());
    }
  };
}
