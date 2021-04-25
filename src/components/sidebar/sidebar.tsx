import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faHome,
  faAddressBook,
  faUser,
  faUsers,
  faUserShield,
  faKey,
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
import { ICurrent } from "../../types";
import { connect } from "react-redux";
import { Row, Col } from "react-bootstrap";

interface IProps {
  isAuthenticated: boolean | null;
  isAdmin: boolean | null;
}

const Nav = ({ isAuthenticated, isAdmin }: IProps) => {
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
        {isAuthenticated ? (
          <Menu iconShape="square">
            <MenuItem>
              <Row>
                <Link to="/account">
                  <Col md={8}>
                    <FontAwesomeIcon
                      icon={isAdmin ? faUserShield : faUser}
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
  );
};

const mapStateToProps = (state: ICurrent) => ({
  isAuthenticated: state.isAuthenticated,
  isAdmin: state.isAdmin,
});

export default connect(mapStateToProps)(Nav);
