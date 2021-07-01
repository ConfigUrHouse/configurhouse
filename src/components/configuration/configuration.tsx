import React from 'react';
import { ApiResponseError } from '../../api/models';
import { apiRequest } from '../../api/utils';
import {
  faDownload,
  faEuroSign,
  faHome,
  faLightbulb,
  faMousePointer,
  faPaperPlane,
  faSearchPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Modal, Row, Table } from 'react-bootstrap';
import './configuration.css';
import { Bar, Chart } from 'react-chartjs-2';
import { getChartData } from '../../utils/conso';

class Configuration extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      configuration: {},
      options: [],
      houseModel: {},
      id: parseInt(props.match.params.id ?? 0),
      conso: undefined,
      estimateModalIsOpen: false,
    };

    Chart.defaults.plugins.legend.display = true;
    Chart.defaults.plugins.legend.position = 'bottom';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
  }

  componentDidMount() {
    this.fetchConfiguration();
    this.fetchConsommation();
    this.sendConfiguration = this.sendConfiguration.bind(this);
    this.downloadConsommation = this.downloadConsommation.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.seeConsoDetails = this.seeConsoDetails.bind(this);
  }

  private handleModalClose(): void {
    this.setState({ error: undefined });
  }

  private seeConsoDetails(): void {
    this.props.history.push(`${this.state.id}/details?tab=conso`);
  }

  async fetchConfiguration(): Promise<void> {
    await apiRequest(`configuration/` + this.state.id, 'GET', [])
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
      'GET',
      []
    )
      .then((model: any) => {
        apiRequest(`modelType/` + model.id_ModelType, 'GET', [])
          .then((modelDetails: any) => {
            console.log(modelDetails);
            this.setState({
              houseModel: {
                id: model.id,
                name: model.name,
                price: model.price,
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
    await apiRequest(`configurationValue/` + this.state.id, 'GET', [])
      .then((response) => {
        response.forEach((element: any) => {
          apiRequest(`value/` + element.id_Value, 'GET', [])
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
      const response = await apiRequest(
        `configuration/${this.state.id}/send`,
        'GET',
        []
      );
      if (response.status === 'error') {
        this.setState({ error: response as ApiResponseError });
      }
    } catch (error) {
      this.setState({ error: error as ApiResponseError });
    }
  }

  private async downloadConsommation(): Promise<void> {
    try {
      await apiRequest(
        `configuration/${this.state.id}/conso/download`,
        'GET',
        []
      );
    } catch (error) {
      this.setState({ error: error as ApiResponseError });
    }
  }

  private async fetchConsommation(): Promise<void> {
    try {
      const response = await apiRequest(
        `configuration/${this.state.id}/conso`,
        'GET',
        []
      );
      if (response.status === 'error') {
        this.setState({ error: response as ApiResponseError });
      } else {
        this.setState({ conso: response, data: getChartData(response) });
      }
    } catch (error) {
      this.setState({ error: error as ApiResponseError });
    }
  }

  render() {
    const conso = this.state.conso;
    return (
      <main className="p-5 w-100 bg configuration-infos">
        <Modal
          show={!!this.state.estimateModalIsOpen}
          onHide={() => this.setState({ estimateModalIsOpen: false })}
        >
          <Modal.Header>
            <Modal.Title>Téléchargement de devis</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>En quel format voulez vous télécharger le devis ?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ estimateModalIsOpen: false })}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              type="submit"
              href={`${process.env.REACT_APP_API_BASE_URL}/configuration/${this.state.id}/estimate/download?mode=csv`}
              onClick={() => this.setState({ estimateModalIsOpen: false })}
            >
              CSV
            </Button>
            <Button
              variant="primary"
              type="submit"
              href={`${process.env.REACT_APP_API_BASE_URL}/configuration/${this.state.id}/estimate/download?mode=pdf`}
              onClick={() => this.setState({ estimateModalIsOpen: false })}
            >
              PDF
            </Button>
          </Modal.Footer>
        </Modal>
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
                      <td className="price">
                        {parseFloat(option.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-lightgreen font-weight-bold">
                    <td>Coût total des options</td>
                    <td className="price">
                      {parseFloat(
                        this.state.options.reduce(
                          (a: any, b: any) =>
                            parseInt(a) + (parseInt(b['price']) || 0),
                          0
                        )
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </Table>
              <div className="d-flex justify-content-center mt-4">
                <Button
                  variant="primary"
                  className="p-3"
                  onClick={() =>
                    this.props.history.push(
                      `${this.state.id}/details?tab=estimate`
                    )
                  }
                >
                  <FontAwesomeIcon className="mr-2" icon={faSearchPlus} />
                  Voir le détail
                </Button>
              </div>
            </div>
          </Col>
          <Col md={6} className="p-4">
            <div className="rect">
              <h3 className="text-green text-center">
                <FontAwesomeIcon icon={faLightbulb} /> Bilan energétique
              </h3>
              {this.state.conso && (
                <div className="barChart">
                  <Bar
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      scales: {
                        y: {
                          display: false,
                        },
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function (context: any) {
                              var label = context.formattedValue || '';
                              if (label) {
                                label += ' kWh';
                              }
                              if (context.datasetIndex === 0) {
                                const posteConso =
                                  conso.byPosteConso.config.find(
                                    (posteConso: any) =>
                                      posteConso.posteConso === context.label
                                  );
                                const percentage = posteConso
                                  ? posteConso.diffPercentageOfPosteConsoReference
                                  : conso.global.diffPercentage;
                                label += ' (' + percentage + ')';
                              }
                              return label;
                            },
                          },
                        },
                      },
                    }}
                    data={this.state.data?.differences}
                    type={Bar}
                  />
                </div>
              )}
              <div className="d-flex justify-content-center mt-4">
                <Button
                  variant="primary"
                  className="p-3"
                  onClick={this.seeConsoDetails}
                >
                  <FontAwesomeIcon className="mr-2" icon={faSearchPlus} />
                  Voir le détail
                </Button>
              </div>
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
                    <td>Prix du modèle</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{this.state.houseModel.name}</td>
                    <td>{this.state.houseModel.modelName}</td>
                    <td>{this.state.houseModel.modelDescription}</td>
                    <td className="price">
                      {parseFloat(this.state.houseModel.price).toFixed(2)}
                    </td>
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
                <Button
                  variant="primary"
                  className="p-3"
                  onClick={() => this.setState({ estimateModalIsOpen: true })}
                >
                  <FontAwesomeIcon className="mr-2" icon={faDownload} />
                  Télécharger le devis
                </Button>
              </div>
              <div className="d-flex justify-content-center mt-4">
                <Button
                  variant="primary"
                  className="p-3"
                  href={`${process.env.REACT_APP_API_BASE_URL}/configuration/${this.state.id}/conso/download`}
                >
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
          <Modal show={!!this.state.error} onHide={this.handleModalClose}>
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
