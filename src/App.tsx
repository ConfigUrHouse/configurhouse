import "./App.css";
import Home from "./components/Home/Home";
import Sidebar from "./components/Sidebar/Sidebar";
import Configurator from "./components/Configurator/Configurator";
import Policies from "./components/Policies/Policies";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UsersList } from "./components/UsersList/UsersList";
import Mentions from "./components/Mentions/Mentions";
import Contact from "./components/Contact/Contact";
import User from "./components/User/User";

function App() {
  return (
    <div className="App">
      <Router>
        <Sidebar />

        <Switch>
          <Route path="/account">
            <User />
          </Route>
          <Route path="/users">
            <UsersList />
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
          <Route path="/policies">
            <Policies />
          </Route>
          <Route path="/mentions">
            <Mentions />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
