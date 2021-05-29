import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserShield,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Form, Row, Col } from "react-bootstrap";
import { apiRequest } from "../../../api/utils";
import { ApiResponseError } from "../../../api/models";

class UserPolicies extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      polices: [],
      userPolices: [],
      success: 0,
    };
  }

  componentDidMount() {
    this.fetchPolice();
    this.fetchUserPolice();
  }

  async fetchPolice() {
    try {
      const polices: any = await apiRequest("police", "GET");

      this.setState({ polices: polices });
    } catch (error) {
      this.setState({ polices: [] });
    }
  }

  async fetchUserPolice() {
    try {
      const userId = await window.localStorage.getItem("userId");

      const userPolices: any = await apiRequest("userPolice/" + userId, "GET");
      this.setState({ userPolices: userPolices });
    } catch (error) {
      this.setState({ userPolices: [] });
    }
  }
  async handleChange(event: any) {
    if (event.target.value == "false") {
      try {
        const response = await apiRequest(
          `userPolice/${event.target.name}`,
          "DELETE",
          []
        );

        if (response.status === "error") {
          this.setState({ error: response as ApiResponseError });
        } else {
          this.fetchUserPolice();
          this.setState({ success: 1 });
        }
      } catch (error) {
        this.setState({ success: -1 });
      }
    } else {
      const userId = await window.localStorage.getItem("userId");

      apiRequest(`userPolice`, "POST", "", {
        id_User: userId,
        id_Police: event.target.name,
      })
        .then((response) => {
          if (response.status === "error") {
            this.setState({ error: response as ApiResponseError });
          } else {
            this.fetchUserPolice();
            this.setState({ success: 1 });
          }
        })
        .catch(() => this.setState({ success: -1 }));
    }
  }
  render() {
    let alertDiv;
    if (this.state.success == 1) {
      alertDiv = (
        <div className="alert alert-success mb-4">
          <FontAwesomeIcon icon={faCheck} /> Préférences changées avec succès
        </div>
      );
    } else if (this.state.success == -1) {
      alertDiv = (
        <div className="alert alert-danger m-4">
          <FontAwesomeIcon icon={faTimes} /> Une erreur est survenue lors du
          changement des préférences
        </div>
      );
    }

    return (
      <main className="p-5 w-100 bg-white m-0 user-policies">
        <h2 className="text-green text-center">
          <FontAwesomeIcon icon={faUserShield} /> Mes politiques de
          confidentialité
        </h2>
        <h6 className="text-center mt-2 mb-5">
          Vous pouvez ici gérer votre préférences de confidentialité
          (utilisation de vos données, ...).
        </h6>
        <hr />
        <h4 className="mt-5 text-green mb-4">
          <FontAwesomeIcon icon={faUserShield} /> Gérer mes préférences de
          gestion de mes données :
        </h4>

        {alertDiv}
        {this.state.polices.map((police: any, i: number) => (
          <Row key={i}>
            <Col md={6}>
              <p>{police.description}</p>
            </Col>
            <Col md={2}>
              <Form.Check
                type="radio"
                label="Oui"
                name={police.id}
                inline
                id={police.name + "_yes"}
                value="true"
                checked={
                  this.state.userPolices.filter(
                    (p: any) => p.id_Police == police.id
                  ).length > 0
                }
                onChange={this.handleChange.bind(this)}
              />
              <Form.Check
                type="radio"
                label="Non"
                inline
                name={police.id}
                id={police.name + "_no"}
                value="false"
                checked={
                  this.state.userPolices.filter(
                    (p: any) => p.id_Police == police.id
                  ).length <= 0
                }
                onChange={this.handleChange.bind(this)}
              />
            </Col>
          </Row>
        ))}

        <div className="circle1"></div>
        <div className="circle2"></div>
      </main>
    );
  }
}

export default UserPolicies;
