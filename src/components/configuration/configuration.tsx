import React from "react";
import { ApiResponseError } from "../../api/models";
import { apiRequest } from "../../api/utils";
import {
  faDownload,
  faEuroSign,
  faHome,
  faLightbulb,
  faMousePointer,
  faPaperPlane,
  faSearchPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Modal, Row, Table } from "react-bootstrap";
import "./configuration.css";

class Configuration extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      configuration: {},
      options: [],
      houseModel: {},
      id: parseInt(props.match.params.id ?? 0),
    };
  }

  componentDidMount() {
    this.fetchConfiguration();
    this.sendConfiguration = this.sendConfiguration.bind(this);
    this.downloadConsommation = this.downloadConsommation.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  private handleModalClose(): void {
    this.setState({ error: undefined });
  }

  async fetchConfiguration(): Promise<void> {
    await apiRequest(`configuration/` + this.state.id, "GET", [])
      .then((response) => {
        this.setState({ configuration: response });
        this.fetchConfigurationOptions();
        this.fetchHouseModel();
      })
      .catch((error) => {
        this.setState({ error: error as ApiResponseError });
      });
  }

  async fetchHouseModel(): Promise<void> {
    const response: any = await apiRequest(
      `houseModel/` + this.state.configuration.id_HouseModel,
      "GET",
      []
    )
      .then((model: any) => {
        apiRequest(`modelType/` + model.id_ModelType, "GET", [])
          .then((modelDetails: any) => {
            console.log(modelDetails);
            this.setState({
              houseModel: {
                id: model.id,
                name: model.name,
                modelName: modelDetails.name,
                modelDescription: modelDetails.description,
                modelId: modelDetails.id,
              },
            });
          })
          .catch((error) => {
            this.setState({ error: error as ApiResponseError });
          });
      })
      .catch((error) => {
        this.setState({ error: error as ApiResponseError });
      });
    this.setState({ model: response });
  }
  async fetchConfigurationOptions(): Promise<void> {
    await apiRequest(`configurationValue/` + this.state.id, "GET", [])
      .then((response) => {
        response.forEach((element: any) => {
          apiRequest(`value/` + element.id_Value, "GET", [])
            .then((option) => {
              this.setState({
                options: this.state.options.concat([option]),
              });
            })
            .catch((error) => {
              this.setState({ error: error as ApiResponseError });
            });
        });
      })
      .catch((error) => {
        this.setState({ error: error as ApiResponseError });
      });
  }

  private async sendConfiguration(): Promise<void> {
    try {
      const response = await apiRequest(`configuration/${this.state.id}/send`, "GET", []);
      if (response.status === "error") {
        this.setState({ error: response as ApiResponseError });
      }
    } catch (error) {
      this.setState({ error: error as ApiResponseError });
    }
  }

  private async downloadConsommation(): Promise<void> {
    try {
      await apiRequest(`configuration/${this.state.id}/conso/download`, "GET", []);
    } catch (error) {
      this.setState({ error: error as ApiResponseError });
    }
  }

  render() {
    return (
      <main className="p-5 w-100 bg configuration-infos">
        <h2 className="text-green mb-2">
          <FontAwesomeIcon icon={faSearchPlus} /> Détails de votre configuration
          : <strong>{this.state.configuration.name}</strong>
        </h2>
        <Row>
          <Col md={6} className="p-4">
            <div className="rect">
              <h3 className="text-green text-center">
                <FontAwesomeIcon icon={faEuroSign} /> Vos options
              </h3>
              <Table bordered hover className="text-center mt-4">
                <thead>
                  <tr>
                    <td>Nom de l'option</td>
                    <td>Prix de l'option</td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.options.map((option: any, i: number) => (
                    <tr key={i}>
                      <td>{option.name}</td>
                      <td>{option.price} €</td>
                    </tr>
                  ))}
                  <tr className="bg-lightgreen font-weight-bold">
                    <td>Coût total des options</td>
                    <td>
                      {this.state.options.reduce(
                        (a: any, b: any) =>
                          parseInt(a) + (parseInt(b["price"]) || 0),
                        0
                      )}{" "}
                      €
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
          <Col md={6} className="p-4">
            <div className="rect">
              <h3 className="text-green text-center">
                <FontAwesomeIcon icon={faLightbulb} /> Bilan energétique
              </h3>
            </div>
          </Col>
          <Col md={6} className="p-4">
            <div className="rect">
              <h3 className="text-green text-center">
                <FontAwesomeIcon icon={faHome} /> Modèle choisi
              </h3>
              <Table bordered hover className="text-center mt-4">
                <thead>
                  <tr>
                    <td>Nom</td>
                    <td>Catégorie du modèle</td>
                    <td>Description du modèle</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{this.state.houseModel.name}</td>
                    <td>{this.state.houseModel.modelName}</td>
                    <td>{this.state.houseModel.modelDescription}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
          <Col md={6} className="p-4">
            <div className="rect">
              <h3 className="text-green text-center">
                <FontAwesomeIcon icon={faMousePointer} /> Actions
              </h3>
              <div className="d-flex justify-content-center mt-4">
                <Button variant="primary" href="/" className="p-3">
                  <FontAwesomeIcon className="mr-2" icon={faDownload} />
                  Télécharger le devis
                </Button>
              </div>
              <div className="d-flex justify-content-center mt-4">
                <Button variant="primary" className="p-3" href={`${process.env.REACT_APP_API_BASE_URL}/configuration/${this.state.id}/conso/download`}>
                  <FontAwesomeIcon className="mr-2" icon={faDownload} />
                  Télécharger la consommation détaillée
                </Button>
              </div>
              <div className="d-flex justify-content-center mt-4">
                <Button
                  variant="primary"
                  className="p-3"
                  onClick={this.sendConfiguration}
                >
                  <FontAwesomeIcon className="mr-2" icon={faPaperPlane} />
                  Envoyer la configuration à Deschampignons
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        {this.state.error && (
            <Modal show={!!this.state.error} onHide={this.handleModalClose} variant="danger">
            <Modal.Header closeButton>
              <Modal.Title>Erreur</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Une erreur est survenue :</p>
              <p>{this.state.error.message}</p>
            </Modal.Body>
          </Modal>
          )}
        <div className="circle1"></div>
        <div className="circle2"></div>
      </main>
    );
  }
}

export default Configuration;
