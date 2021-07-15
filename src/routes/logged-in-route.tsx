import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { ICurrent } from '../types';

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
  const { pathname } = useLocation();

  if (isAuthenticated === false) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: pathname },
        }}
      />
    );
  }
  return <Route {...otherProps} render={(props) => <Component {...props} />} />;
};
const mapStateToProps = (state: ICurrent) => ({
  isAuthenticated: state.isAuthenticated,
});
export default connect(mapStateToProps)(LoggedInRoute);
