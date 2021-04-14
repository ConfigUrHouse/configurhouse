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
function authenticateAdmin(){
  return {
    type: constants.AUTHENTICATEADMIN,
  };
}

export type AuthenticationAction = IAuthenticate | IUnauthenticate | IAuthenticateAdmin;
export function logIn(token : string, isAdmin: boolean) {
  return async (dispatch: Dispatch<AuthenticationAction, {}, any>) => {
    await window.localStorage.setItem("authenticated", "true");
    await window.localStorage.setItem("token", token);
    await window.localStorage.setItem("admin", isAdmin.toString());
    if(isAdmin)
      dispatch(authenticateAdmin());
    else
      dispatch(authenticate());
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
    formattedAuth ? dispatch(authenticate()) : dispatch(unauthenticate());
  };
}
export function checkAdmin() {
  return async (dispatch: Dispatch<AuthenticationAction, {}, any>) => {
    const auth = await window.localStorage.getItem("admin");
    const formattedAuth = typeof auth === "string" ? JSON.parse(auth) : null;
    formattedAuth ? dispatch(authenticateAdmin()) : dispatch(authenticate());
  };
}