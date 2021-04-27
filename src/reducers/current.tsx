import {
  IAuthenticate,
  IAuthenticateAdmin,
  IUnauthenticate,
} from "../actions/current";
import { AUTHENTICATE, AUTHENTICATEADMIN, UNAUTHENTICATE } from "../constants";
import { ICurrent } from "../types";
export default function currentReducer(
  state: ICurrent = {
    isAuthenticated: null,
    isAdmin: null,
  },
  action: IAuthenticate | IUnauthenticate | IAuthenticateAdmin
): ICurrent {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        ...state,
        isAuthenticated: true,
        isAdmin: false,
      };
    case AUTHENTICATEADMIN:
      return {
        ...state,
        isAdmin: true,
        isAuthenticated: true,
      };
    case UNAUTHENTICATE:
      return { isAuthenticated: false, isAdmin: false };
  }
  return state;
}
