import React from 'react';
import logo from '../../assets/images/logo.svg';
import './Sidebar.css';
import { Button, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faHome, faAddressBook, faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import {
    Link
  } from "react-router-dom";

function Sidebar() {
    return (
        <ProSidebar breakPoint="md" className="position-fixed">
                    <SidebarHeader>
                    <Link to="/"><h2 className="title">ConfigUr<br /><span>house.</span></h2></Link>
                    </SidebarHeader>
                    <SidebarContent>
                        <MenuItem className="m-5"><FontAwesomeIcon icon={faCog} size="lg" className="mr-2"/> <Link to="/config">Configurateur</Link></MenuItem>
                        <MenuItem className="m-5"><FontAwesomeIcon icon={faHome} size="lg" className="mr-2"/> <Link to="/models">Modèles</Link></MenuItem>
                        <MenuItem className="m-5"><FontAwesomeIcon icon={faAddressBook} size="lg" className="mr-2"/> <Link to="/contact">Contact</Link></MenuItem>
                    </SidebarContent>
                    <SidebarFooter>
                    <Menu iconShape="square">
                        <MenuItem ><FontAwesomeIcon icon={faSignOutAlt} size="lg" className="mr-2"/>Me déconnecter</MenuItem>
                    </Menu>
                    </SidebarFooter>
            </ProSidebar>
       
    );
}

export default Sidebar