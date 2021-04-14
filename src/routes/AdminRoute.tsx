import * as React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { ICurrent } from "../types";
interface IProps {
  exact?: boolean;
  isAdmin: boolean | null;
  path: string;
  component: React.ComponentType<any>;
}
const AdminRoute = ({
  component: Component,
  isAdmin,
  ...otherProps
}: IProps) => {
  if (isAdmin === false) {
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
    isAdmin: state.isAdmin,
});
export default connect(mapStateToProps)(AdminRoute);
