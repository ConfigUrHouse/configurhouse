import React from "react";
import logo from "../../assets/images/logo.svg";
import "./Sidebar.css";
import { Button, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faHome,
  faAddressBook,
  faBars,
  faSignOutAlt,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <ProSidebar breakPoint="md" className="position-fixed">
      <SidebarHeader>
        <Link to="/">
          <h2 className="title">
            ConfigUr
            <br />
            <span>house.</span>
          </h2>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <MenuItem className="m-5">
          <FontAwesomeIcon icon={faCog} size="lg" className="mr-2" />{" "}
          <Link to="/config">Configurateur</Link>
        </MenuItem>
        <MenuItem className="m-5">
          <FontAwesomeIcon icon={faAddressBook} size="lg" className="mr-2" />{" "}
          <Link to="/contact">Contact</Link>
        </MenuItem>
        <MenuItem className="m-5">
          <FontAwesomeIcon icon={faHome} size="lg" className="mr-2" />{" "}
          <Link to="/houseModels">Modèles</Link>
        </MenuItem>
        <MenuItem className="m-5">
          <FontAwesomeIcon icon={faUsers} size="lg" className="mr-2" />{" "}
          <Link to="/users">Utilisateurs</Link>
        </MenuItem>
      </SidebarContent>
      <SidebarFooter>
        <Link to="/account">
          <Menu iconShape="square">
            <MenuItem>
              <FontAwesomeIcon icon={faUser} size="lg" className="mr-2" />
              Mon compte
            </MenuItem>
          </Menu>
        </Link>
      </SidebarFooter>
    </ProSidebar>
  );
}

export default Sidebar;
