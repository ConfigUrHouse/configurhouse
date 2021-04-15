import './App.css';
import Home from './components/Home/Home';
import Sidebar from './components/Sidebar/Sidebar';
import Configurator from './components/Configurator/Configurator';
import Policies from './components/Policies/Policies';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { UserListWithRouter } from './components/User/UserList/UserList';
import { UserEditWithRouter } from './components/User/UserEdit/UserEdit';
import User from './components/User/User';
import Mentions from './components/Mentions/Mentions';
import Contact from './components/Contact/Contact';
import HouseModelList from './components/HouseModels/HouseModelList/HouseModelList';
import HouseModelEdit from './components/HouseModels/HouseModelEdit/HouseModelEdit';

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
