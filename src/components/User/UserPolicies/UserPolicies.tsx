import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import { Form, Row, Col } from "react-bootstrap";

class UserPolicies extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
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
        <Row>
          <Col md={6}>
            <p>Utilisation de mes données à des fin commerciales :</p>
          </Col>
          <Col md={2}>
            <Row>
              <Col md={5}>
                <Form.Check
                  type="radio"
                  label="Oui"
                  name="formHorizontalRadios"
                  id="formHorizontalRadios1"
                />
              </Col>
              <Col md={2}>
                <Form.Check
                  type="radio"
                  label="Non"
                  name="formHorizontalRadios"
                  id="formHorizontalRadios1"
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <p>
              Utilisation de mes données (anonymisées) à des fins statistiques :
            </p>
          </Col>
          <Col md={2}>
            <Row>
              <Col md={5}>
                <Form.Check
                  type="radio"
                  label="Oui"
                  name="formHorizontalRadios"
                  id="formHorizontalRadios1"
                />
              </Col>
              <Col md={2}>
                <Form.Check
                  type="radio"
                  label="Non"
                  name="formHorizontalRadios"
                  id="formHorizontalRadios1"
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="circle1"></div>
        <div className="circle2"></div>
      </main>
    );
  }
}

export default UserPolicies;
