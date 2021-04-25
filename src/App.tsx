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
import {  checkAuthentication, checkAdmin } from "./actions/current";
import { connect } from "react-redux";
import * as React from "react";
import LoggedInRoute from "./routes/LoggedInRoute";
import LoggedOutRoute from "./routes/LoggedOutRoute";
import Login from "./components/Login/Login";
import AdminRoute from "./routes/AdminRoute";

interface IProps {
  checkAuthenticationConnect: () => void;
  isAuthenticated: boolean | null;
  checkAdmin:() => void;
  isAdmin: boolean | null;
}

const App = ({ checkAuthenticationConnect, isAuthenticated,checkAdmin, isAdmin}: IProps) => {
  React.useEffect(() => {
    checkAuthenticationConnect();
    checkAdmin();
  }, []);

  const app =
    isAuthenticated !== null ? (
      <Router>
        <Sidebar />
        <Switch>
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
          
          <AdminRoute path="/users" exact={true} component={UserListWithRouter} />
          <AdminRoute path="/user/:id/edit" exact={true} component={UserEditWithRouter} />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    ) : null;

  return <div className="App">{app}</div>;
};

const mapStateToProps = (state: ICurrent) => ({
  isAuthenticated: state.isAuthenticated,
  isAdmin: state.isAdmin,
});

const mapDispatchToProps = {
  checkAuthenticationConnect: checkAuthentication,
  checkAdmin: checkAdmin
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
