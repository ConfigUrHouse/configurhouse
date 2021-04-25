import * as React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { ICurrent } from "../types";
interface IProps {
  exact?: boolean;
  isAuthenticated: boolean | null;
  path: string;
  component: React.ComponentType<any>;
}
const LoggedInRoute = ({
  component: Component,
  isAuthenticated,
  ...otherProps
}: IProps) => {
  
  if (isAuthenticated === false) {
     return <Redirect to="/login" />;
  }
  return (
    <>
      <Route
        render={(otherProps) => (
          <>
            <Component {...otherProps} />
          </>
        )}
      />
    </>
  );
};
const mapStateToProps = (state: ICurrent) => ({
  isAuthenticated: state.isAuthenticated,
});
export default connect(mapStateToProps)(LoggedInRoute);
