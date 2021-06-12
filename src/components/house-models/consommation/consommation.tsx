import {
  faBolt,
  faChartPie,
  faEuroSign,
  faHome,
  faLightbulb,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, ListGroup, Row, Table } from "react-bootstrap";
import { withRouter } from "react-router";
import { ApiResponseError } from "../../../api/models";
import { apiRequest } from "../../../api/utils";
import { ConsommationProps, ConsommationState } from "./models";
import "./consommation.css";
import { Bar, Chart, Doughnut } from "react-chartjs-2";

class Consommation extends React.Component<
  ConsommationProps,
  ConsommationState
> {
  constructor(props: ConsommationProps) {
    super(props);

    this.state = {
      conso: undefined,
      data: undefined,
      error: undefined,
    };

    Chart.defaults.plugins.legend.display = true;
    Chart.defaults.plugins.legend.position = "right";
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.pointStyle = "circle";
  }

  private repartitionChartRef = {};
  private repartitionRefChartRef = {};
  private differencesChartRef = {};

  private async fetchConso() {
    try {
      const response = await apiRequest(
        `configuration/${this.props.match.params.id}/conso`,
        "GET"
      );
      if (response.status === "error") {
        this.setState({ error: response as ApiResponseError });
      } else {
        this.setState({ conso: response });
        const repartition = {
          labels: this.state.conso?.byPosteConso.config.map(
            (item: any) => item.posteConso
          ),
          datasets: [
            {
              label: "# of Consommation",
              data: this.state.conso?.byPosteConso.config.map(
                (item: any) => item.conso
              ),
              backgroundColor: ["#1a7c7d", "#a8cfcf", "#09444d", "#18b9ba"],
              borderWidth: 0,
            },
          ],
        };
        const repartitionRef = {
          labels: this.state.conso?.byPosteConso.reference.map(
            (item: any) => item.posteConso.name
          ),
          datasets: [
            {
              label: "# of Consommation",
              data: this.state.conso?.byPosteConso.reference.map(
                (item: any) => item.conso
              ),
              backgroundColor: ["#1a7c7d", "#a8cfcf", "#09444d", "#18b9ba"],
              borderWidth: 0,
            },
          ],
        };
        const postesConso = this.state.conso?.byPosteConso.reference.map(
          (item: any) => item.posteConso.name
        );
        const differences = {
          labels: ["Total"].concat(postesConso),
          datasets: [
            {
              label: "Configuration",
              data: [this.state.conso?.global.config].concat(
                postesConso.map(
                  (posteConso: string) =>
                    this.state.conso?.byPosteConso.config.find(
                      (item: any) => item.posteConso === posteConso
                    ).conso
                )
              ),
              backgroundColor: "#1a7c7d",
              borderWidth: 0,
            },
            {
              label: "Référence",
              data: [this.state.conso?.global.reference].concat(
                this.state.conso?.byPosteConso.reference.map(
                  (item: any) => item.conso
                )
              ),
              backgroundColor: "#a8cfcf",
              borderWidth: 0,
            },
          ],
        };
        this.setState({
          data: {
            repartition,
            repartitionRef,
            differences,
          },
        });
        (this.repartitionChartRef as any).chartInstance.update();
        (this.repartitionRefChartRef as any).chartInstance.update();
        (this.differencesChartRef as any).chartInstance.update();
      }
    } catch (error) {
      this.setState({ error: error as ApiResponseError });
    }
  }

  componentDidMount() {
    this.fetchConso();
  }

  render() {
    const conso = this.state.conso;
    return (
      <main className="p-5 w-100 bg-white m-0 consommation">
        <h2 className="text-green text-center">
          <FontAwesomeIcon icon={faLightbulb} /> Estimation de consommation
        </h2>
        <h6 className="text-center mt-2 mb-5">
          Voici une estimation de la consommation du modèle avec sa
          configuration par défaut, par rapport à une consommation de référence.
        </h6>
        <hr />
        {this.state.conso && (
          <div>
            <Row>
              <Col md={12} className="p-4">
                <div className="rect">
                  <h3 className="text-green text-center">
                    <FontAwesomeIcon icon={faBolt} /> Consommation par poste
                  </h3>
                  <div className="barChart">
                    <Bar
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        // scales: {
                        //   x: {
                        //     stacked: true,
                        //   },
                        //   y: {
                        //     stacked: true,
                        //   },
                        // },
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: function (context: any) {
                                var label = context.formattedValue || "";
                                if (label) {
                                  label += " kWh";
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
                                  label += " (" + percentage + ")";
                                }
                                return label;
                              },
                            },
                          },
                        },
                      }}
                      data={this.state.data?.differences}
                      type={Bar}
                      ref={(reference) =>
                        (this.differencesChartRef = reference)
                      }
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="p-4">
                <div className="rect">
                  <h3 className="text-green text-center">
                    <FontAwesomeIcon icon={faChartPie} /> Répartition par poste
                    (configuration)
                  </h3>
                  <div className="doughnutChart">
                    <Doughnut
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: function (context: any) {
                                var label = context.parsed + " kWh";
                                return label;
                              },
                            },
                          },
                        },
                      }}
                      data={this.state.data?.repartition}
                      type={Doughnut}
                      ref={(reference) =>
                        (this.repartitionChartRef = reference)
                      }
                    />
                  </div>
                </div>
              </Col>
              <Col md={6} className="p-4">
                <div className="rect">
                  <h3 className="text-green text-center">
                    <FontAwesomeIcon icon={faChartPie} /> Répartition par poste
                    (référence)
                  </h3>
                  <div className="doughnutChart">
                    <Doughnut
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: function (context: any) {
                                var label = context.parsed || "";
                                if (label) {
                                  label += " kWh";
                                }
                                return label;
                              },
                            },
                          },
                        },
                      }}
                      data={this.state.data?.repartitionRef}
                      type={Doughnut}
                      ref={(reference) =>
                        (this.repartitionRefChartRef = reference)
                      }
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="p-4">
                <div className="rect">
                  <h3 className="text-green text-center">
                    <FontAwesomeIcon icon={faHome} /> Contexte
                  </h3>
                  <span>
                    Consommation d'énergie par an, pour{" "}
                    {this.state.conso.context.occupants} personnes
                  </span>
                  <Table bordered hover className="mt-5 text-center">
                    <caption className="text-green">Options choisies</caption>
                    <thead>
                      <tr>
                        <th>Option</th>
                        <th>Valeur</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.conso.context.options.map(
                        (option: any, index: number) => {
                          return (
                            <tr key={index}>
                              <td>{option.option}</td>
                              <td>{option.value}</td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col md={6} className="p-4">
                <div className="rect">
                  <h3 className="text-green text-center">
                    <FontAwesomeIcon icon={faList} /> Postes de consommation
                  </h3>
                  <ListGroup variant="flush">
                    {this.state.conso.byPosteConso.reference.map(
                      (conso: any, index: any) => (
                        <ListGroup.Item key={index}>
                          <span className="text-green">
                            {conso.posteConso.name}
                          </span>
                          <br />
                          {conso.posteConso.description}
                        </ListGroup.Item>
                      )
                    )}
                  </ListGroup>
                </div>
              </Col>
            </Row>
          </div>
        )}
        <div className="circle1"></div>
        <div className="circle2"></div>
      </main>
    );
  }
}

export default withRouter(Consommation);
