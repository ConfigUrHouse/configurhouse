import React from "react";
import { ApiResponseError } from "../../../api/models";
import { Col, Row, Table } from "react-bootstrap";
import home_3D from "../../../assets/images/home-3D.png";
import "./model-choice.css";
import { apiRequest } from "../../../api/utils";
class ModelChoice extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { modelSelected:null,models: []};
    this.fetchHouseModels();

  }
  selectModel(model: any) {
    this.setState({ modelSelected: model });
    this.props.onChange(model);
  }
  

  async fetchHouseModels(): Promise<void> {
    apiRequest(`houseModel`, "GET", [])
      .then((response) => {
        if (response.status === "error") {
          this.setState({ error: response as ApiResponseError });
        } else {
          this.setState({ models: response.items, modelSelected: response.items[0]});
          this.props.onChange(this.state.modelSelected);

        }
      })
      .catch((error) => console.log(error));
  }

  render() {
    const { models } = this.state
    return (
        <div className="models-choice">
            <Row>
            {models.map((item: any) => {
              return (
                <Col>
                <div
                  className={`model ${
                    this.state.modelSelected == item ? "selected" : ""
                  }`}
                  onClick={(e) => this.selectModel(item)}
                >
                  <h4>Modèle {item.name}</h4>
                  <img src={home_3D} alt="Home config" className="w-100" />
                  <Table bordered hover className="mt-5 text-center">
                    <thead>
                      <tr>
                        <th colSpan={2}>Caractéristique du modèle {item.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="sub">
                        <td colSpan={2}>Dimensions</td>
                      </tr>
                      <tr>
                        <td>Longueur</td>
                        <td>12.53m</td>
                      </tr>
                      <tr>
                        <td>Largeur</td>
                        <td>12.53m</td>
                      </tr>
                      <tr>
                        <td>Hauteur sous plafond</td>
                        <td>2.53m</td>
                      </tr>
                      <tr className="sub">
                        <td colSpan={2}>Autres</td>
                      </tr>
                      <tr>
                        <td>Longueur</td>
                        <td>12.53m</td>
                      </tr>
                      <tr>
                        <td>Largeur</td>
                        <td>12.53m</td>
                      </tr>
                      <tr>
                        <td>Hauteur sous plafond</td>
                        <td>2.53m</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Col>
              )
            })}
            </Row>
          </div>
    );
  }
}

export default ModelChoice;
