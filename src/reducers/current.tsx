import { IAuthenticate, IUnauthenticate } from "../actions/current";
import { AUTHENTICATE, UNAUTHENTICATE } from "../constants";
import { ICurrent } from "../types";
export default function currentReducer(
  state: ICurrent = {
    isAuthenticated: null,
    isAdmin: null,
  },
  action: IAuthenticate | IUnauthenticate, 
): ICurrent {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        ...state,
        isAuthenticated: true,
      };
    case UNAUTHENTICATE:
      return { isAuthenticated: false, isAdmin: false };
    
  }
  return state;
}
