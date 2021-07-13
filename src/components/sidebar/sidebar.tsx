import "./sidebar.css";
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faHome,
  faAddressBook,
  faUser,
  faUsers,
  faUserShield,
  faKey,
  faCogs,
  faFile,
  faBars
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";
import Logout from "../logout/logout";
import { Row, Col } from "react-bootstrap";
import { withRouter } from 'react-router-dom';
import { ICurrent } from '../../types';
import { connect } from 'react-redux';


class Nav extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
          collapsed:true
        };
        this.collapseSidebar = this.collapseSidebar.bind(this);

    }

    collapseSidebar(){
        this.setState({collapsed: !this.state.collapsed})
        console.log("collapse")
    }
    render() {
        let accountIcon = faUser;
        if (this.props.isAdmin) {
            accountIcon = faUserShield;
        }
        let btnCollapsedclassName = "collapseBtn";
        if (this.state.collapsed) {
            btnCollapsedclassName += ' collapsed';
          }
        return (
            
            <div>
                <button className={btnCollapsedclassName} onClick={this.collapseSidebar}><FontAwesomeIcon icon={faBars} size="lg" /></button>
                <ProSidebar breakPoint="md" className="position-fixed" collapsed={!this.state.collapsed}>
                <SidebarHeader>
                    <Link to="/">
                    <h2 className="cfgTitle">
                        <span className="cfgTitleTop" >ConfigUr</span>
                        <span className="cfgTitleBottom" >house.</span>
                    </h2>
                    </Link>
                </SidebarHeader>
                <SidebarContent>
                    <MenuItem className="cfgMenuItem">
                    <FontAwesomeIcon icon={faCog} size="lg" className="mr-2" />{" "}
                    <Link to="/config">Configurateur</Link>
                    </MenuItem>
                    <MenuItem className="cfgMenuItem">
                    <FontAwesomeIcon icon={faAddressBook} size="lg" className="mr-2" />{" "}
                    <Link to="/contact">Contact</Link>
                    </MenuItem>
                    {this.props.isAdmin ? (
                    <>
                        <MenuItem className="cfgMenuItem">
                        <FontAwesomeIcon icon={faCogs} size="lg" className="mr-2" />{" "}
                        <Link to="/configurationOptions">Options de Configuration</Link>
                        </MenuItem>
                        <MenuItem className="cfgMenuItem">
                        <FontAwesomeIcon icon={faHome} size="lg" className="mr-2" />{" "}
                        <Link to="/houseModels">Modèles</Link>
                        </MenuItem>
                        <MenuItem className="cfgMenuItem">
                        <FontAwesomeIcon icon={faUsers} size="lg" className="mr-2" />{" "}
                        <Link to="/users">Utilisateurs</Link>
                        </MenuItem>
                        <MenuItem className="cfgMenuItem">
                        <FontAwesomeIcon icon={faUserShield} size="lg" className="mr-2" />{" "}
                        <Link to="/roles">Roles</Link>
                        </MenuItem>
                        <MenuItem className="cfgMenuItem">
                        <FontAwesomeIcon icon={faFile} size="lg" className="mr-2" />{" "}
                        <Link to="/asset">Asset</Link>
                        </MenuItem>
                    </>
                    )
                    : <></>}
                </SidebarContent>
                <SidebarFooter>
                    {this.props.isAuthenticated ? (
                    <Menu iconShape="square">
                        <MenuItem>
                        <Row>
                            <Link to="/account">
                            <Col md={8}>
                                <FontAwesomeIcon
                                icon={accountIcon}
                                size="lg"
                                className="mr-2"
                                />{" "}
                                Mon compte
                            </Col>
                            </Link>
                            <Col md={4}>
                            <Logout />
                            </Col>
                        </Row>
                        </MenuItem>
                    </Menu>
                    ) : (
                    <Link to="/login">
                        <Menu iconShape="square">
                        <MenuItem>
                            <FontAwesomeIcon icon={faKey} size="lg" className="mr-2" />
                            Se connecter
                        </MenuItem>
                        </Menu>
                    </Link>
                    )}
                </SidebarFooter>
                </ProSidebar>
            </div>
        
        );
    };

}
const mapStateToProps = (state: ICurrent) => ({
    isAuthenticated: state.isAuthenticated,
    isAdmin: state.isAdmin
  });
export default connect(mapStateToProps)(withRouter(Nav));
  