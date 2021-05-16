import { ThunkDispatch as Dispatch } from "redux-thunk";
import * as constants from "../constants";
export interface IAuthenticate {
  type: constants.AUTHENTICATETYPE;
}
function authenticate(): IAuthenticate {
  return {
    type: constants.AUTHENTICATE,
  };
}
export interface IUnauthenticate {
  type: constants.UNAUTHENTICATETYPE;
}
function unauthenticate(): IUnauthenticate {
  return {
    type: constants.UNAUTHENTICATE,
  };
}
export interface IAuthenticateAdmin {
  type: constants.AUTHENTICATEADMINTYPE;
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
export function logIn(token: string, isAdmin: boolean, userId: number) {
  return async (dispatch: Dispatch<AuthenticationAction, {}, any>) => {
    setLocalStorage("true", token, isAdmin.toString(), userId);

    if (isAdmin) dispatch(authenticateAdmin());
    else dispatch(authenticate());
  };
}
export function logOut() {
  return async (dispatch: Dispatch<AuthenticationAction, {}, any>) => {
    setLocalStorage("false", "", "false", -1);
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
async function setLocalStorage(auth: string, token: string, admin: string, userId: number) {
  await window.localStorage.setItem("token", token);
  await window.localStorage.setItem("authenticated", auth);
  await window.localStorage.setItem("admin", admin);
  await window.localStorage.setItem("userId", userId.toString());

}
