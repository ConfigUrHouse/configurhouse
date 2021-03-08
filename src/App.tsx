import React, { useState } from "react";
import "./App.css";
import Home from "./components/Home/Home";
import Sidebar from "./components/Sidebar/Sidebar";
import Configurator from "./components/Configurator/Configurator";

import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UsersList } from "./components/UsersList/UsersList";

function App() {
  return (
    <div className="App">
      <Router>
        <Sidebar />

        <Switch>
          <Route path="/users">
            <UsersList />
          </Route>
          <Route path="/config">
            <Configurator />
          </Route>
          <Route path="/contact">
            <h1>Test</h1>
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
