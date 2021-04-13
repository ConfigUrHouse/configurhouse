import "./App.css";
import Home from "./components/Home/Home";
import Sidebar from "./components/Sidebar/Sidebar";
import Configurator from "./components/Configurator/Configurator";
import Policies from "./components/Policies/Policies";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserListWithRouter } from "./components/User/UserList/UserList";
import { UserEditWithRouter } from "./components/User/UserEdit/UserEdit";
import User from "./components/User/User";
import Mentions from "./components/Mentions/Mentions";
import Contact from "./components/Contact/Contact";
import { ICurrent } from "./types";
import { checkAuthentication } from "./actions/current";
import { connect } from "react-redux";
import * as React from "react";
import LoggedInRoute from "./routes/LoggedInRoute";
import LoggedOutRoute from "./routes/LoggedOutRoute";
import Login from "./components/Login/Login";

interface IProps {
  checkAuthenticationConnect: () => void;
  isAuthenticated: boolean | null;
}

const App = ({
  checkAuthenticationConnect,
  isAuthenticated
}: IProps) => {
  React.useEffect(() => {
    checkAuthenticationConnect();
  }, []);

  const app = isAuthenticated !== null ? (
    <Router>
        <Sidebar />
        <Switch>
          <Route path="/users">
            <UserListWithRouter />
          </Route>
          <Route path="/user/:id/edit">
            <UserEditWithRouter />
          </Route>
          <Route path="/config">
            <Configurator />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
          <Route path="/policies">
            <Policies />
          </Route>
          <Route path="/mentions">
            <Mentions />
          </Route>
          <LoggedOutRoute path="/login" exact={true} component={Login} />
          <LoggedInRoute path="/account" exact={true} component={User} />

          <Route path="/">
            <Home />
          </Route>

        </Switch>
      </Router>
  ) : null;

  return (
    <div className="App">
      {app}
    </div>
  );
}

const mapStateToProps = (state: ICurrent) => ({
  isAuthenticated: state.isAuthenticated
});

const mapDispatchToProps = {
  checkAuthenticationConnect: checkAuthentication
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);