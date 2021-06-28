import React from "react";
import { Col, Row, Form } from "react-bootstrap";
import { ApiResponseError } from "../../../api/models";
import { apiRequest } from "../../../api/utils";
import home_3D from "../../../assets/images/home-3D.png";
import "./model-configuration.css";
class ModelConfiguration extends React.Component<any, any> {
  constructor(props: any) {
    //TODO: use this.props.updateOptionValues() + fetch conso on dropdown change
    super(props);
    this.state = {
      error: undefined,
      conso: undefined,
    };
  }

  async fetchConso() {
    try {
      const response = await apiRequest(
        `houseModel/${this.props.model.id}/conso`,
        "POST",
        "",
        {
          valueIds: this.props.optionValues,
        }
      );
      if (response.status === "error") {
        this.setState({ error: response as ApiResponseError });
      } else {
        this.setState({ conso: response });
      }
    } catch (error) {
      console.log(error);
      this.setState({ error: error as ApiResponseError });
    }
  }

  componentDidMount() {
    this.fetchConso();
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={8} className="col">
            <div className="content">
              <h5>Visualisation du modèle {this.props.model.name}</h5>
              <img src={home_3D} alt="Home config" className="w-100" />
            </div>
          </Col>
          <Col md={4} className="col">
            <div className="content options">
              <h5 className="text-light">Options</h5>
              <Form>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    <option>Parquet Flottant</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    <option>Bardage bois</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    <option>Ossature métale</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    <option>Meublé</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    <option>Papier peint noir</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    <option>Pas de terrasse</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    <option>Isolation passive</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="col devis">
            <div className="content text-center">
              <h5>Aperçu du devis</h5>
              <Row className="mb-0">
                <Col>
                  <h6>Bardage</h6>
                  <p>10 343,56€</p>
                </Col>
                <Col>
                  <h6>Charpente</h6>
                  <p>10 343,56€</p>
                </Col>
                <Col>
                  <h6>Menuiserie</h6>
                  <p>10 343,56€</p>
                </Col>
              </Row>
              <div className="total">34 343,23€</div>
            </div>
          </Col>
          <Col md={4} className="col conso">
            <div className="content text-center">
              <h5>Aperçu de la consommation</h5>
              <Row>
                <Col md={4}>
                  {this.state.conso && (
                    <div className="percentage">
                      {this.state.conso.global.diffPercentage}
                    </div>
                  )}
                </Col>
                <Col md={8}>
                  <div className="conso-label">
                    d'économie par rapport à un logement de référence.
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ModelConfiguration;
