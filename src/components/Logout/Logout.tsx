import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { connect } from "react-redux";
import { logOut } from "../../actions/current";
interface IProps {
  logOutConnect: () => void;
}
const LogOut = ({ logOutConnect }: IProps) => (
  <>
    <FontAwesomeIcon icon={faSignOutAlt} size="lg" onClick={logOutConnect} className="text-danger float-right" />
  </>
);
const mapDispatchToProps = {
  logOutConnect: logOut
};
export default connect(
  null,
  mapDispatchToProps,
)(LogOut);