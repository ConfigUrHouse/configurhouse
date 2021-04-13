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
const LoggedOutRoute = ({
  component: Component,
  isAuthenticated,
  ...otherProps
}: IProps) => {
  if (isAuthenticated === true) {
    return <Redirect to="/account" />
  }
  return (
    <>
      <Route
        render={otherProps => (
          <>
            <Component {...otherProps} />
          </>
        )}
      />
    </>
  );
};
const mapStateToProps = (state: ICurrent) => ({
  isAuthenticated: state.isAuthenticated
});
export default connect(
  mapStateToProps
)(LoggedOutRoute);