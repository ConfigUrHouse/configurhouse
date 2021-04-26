import './app.css';
import Home from './components/home/home';
import Sidebar from './components/sidebar/sidebar';
import Configurator from './components/configurator/configurator';
import Policies from './components/policies/policies';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { UserListWithRouter } from './components/user/user-list/user-list';
import { UserEditWithRouter } from './components/user/user-edit/user-edit';
import User from './components/user/user';
import Mentions from './components/mentions/mentions';
import Contact from './components/contact/contact';
import HouseModelList from './components/house-models/house-model-list/house-model-list';
import HouseModelEdit from './components/house-models/house-model-edit/house-model-edit';
import UserConfigurationEdit from './components/user/user-configuration-edit/user-configuration-edit';

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
            <UserListWithRouter />
          </Route>
          <Route path="/user/:id/edit">
            <UserEditWithRouter />
          </Route>
          <Route path="/houseModels/add">
            <HouseModelEdit />
          </Route>
          <Route path="/houseModels/:id">
            <HouseModelEdit />
          </Route>
          <Route path="/houseModels">
            <HouseModelList />
          </Route>
          <Route path="/config/:id">
            <UserConfigurationEdit />
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
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
