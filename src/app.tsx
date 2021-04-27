import "./app.css";
import Home from "./components/home/home";
import Sidebar from "./components/sidebar/sidebar";
import Configurator from "./components/configurator/configurator";
import Policies from "./components/policies/policies";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserListWithRouter } from "./components/user/user-list/user-list";
import { UserEditWithRouter } from "./components/user/user-edit/user-edit";
import User from "./components/user/user";
import Mentions from "./components/mentions/mentions";
import Contact from "./components/contact/contact";
import HouseModelList from "./components/house-models/house-model-list/house-model-list";
import HouseModelEdit from "./components/house-models/house-model-edit/house-model-edit";
import UserConfigurationEdit from "./components/user/user-configuration-edit/user-configuration-edit";
import { ICurrent } from "./types";
import { checkAuthentication, checkAdmin } from "./actions/current";
import { connect } from "react-redux";
import LoggedInRoute from "./routes/logged-in-route";
import LoggedOutRoute from "./routes/logged-out-route";
import AdminRoute from "./routes/admin-route";
import Login from "./components/login/login";
import React from "react";

interface IProps {
  checkAuthenticationConnect: () => void;
  isAuthenticated: boolean | null;
  checkAdmin: () => void;
  isAdmin: boolean | null;
}

const App = ({ checkAuthenticationConnect, isAuthenticated }: IProps) => {
  React.useEffect(() => {
    checkAuthenticationConnect();
    checkAdmin();
  }, []);

  const app =
    isAuthenticated !== null ? (
      <Router>
        <Sidebar />
        <Switch>
          <LoggedInRoute
            path="/config/:id"
            exact={true}
            component={UserConfigurationEdit}
          />
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

          <AdminRoute
            path="/users"
            exact={true}
            component={UserListWithRouter}
          />
          <AdminRoute
            path="/user/:id/edit"
            exact={true}
            component={UserEditWithRouter}
          />

          <AdminRoute
            path="/houseModels/add"
            exact={true}
            component={HouseModelEdit}
          />
          <AdminRoute
            path="/houseModels/:id"
            exact={true}
            component={HouseModelEdit}
          />
          <AdminRoute
            path="/houseModels"
            exact={true}
            component={HouseModelList}
          />
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
  checkAdmin: checkAdmin,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
