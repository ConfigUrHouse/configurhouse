import React from "react";
import { ApiResponseError } from "../../../api/models";
import { apiRequest } from "../../../api/utils";
import { EstimateProps, EstimateState } from "./models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator, faDownload } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import "./estimate.css";

class Estimate extends React.Component<EstimateProps, EstimateState> {
  constructor(props: EstimateProps) {
    super(props);

    this.state = {
      error: undefined,
      data: null,
    };
  }

  componentDidMount() {
    this.fetchEstimate();
  }

  private async fetchEstimate() {
    try {
      const response = await apiRequest(
        `houseModel/${this.props.match.params.id}/estimate`,
        "GET"
      );
      if (response.status === "error") {
        this.setState({ error: response as ApiResponseError });
      } else {
        this.setState({ data: response });
      }
    } catch (error) {
      this.setState({ error: error as ApiResponseError });
    }
  }

  render() {
    const { data } = this.state;
    return (
      <main className="p-5 w-100 bg-white m-0">
        <div className="estimate-title-container">
          <h2 className="text-green text-center">
            <FontAwesomeIcon icon={faCalculator} /> Devis détaillé
          </h2>
          <h6 className="text-center mt-2 mb-5">
            Le devis détaillé du modèle avec sa configuration par défaut.
          </h6>
          <div className="download-estimate">
            <Button
              variant="primary"
              href={`${process.env.REACT_APP_API_BASE_URL}/houseModel/${this.props.match.params.id}/estimate/download`}
            >
              <FontAwesomeIcon className="mr-2" icon={faDownload} />
              Download
            </Button>
          </div>
        </div>
        <hr />
        {data && (
          <Table bordered hover className="text-center mt-4">
            <thead>
              <tr>
                <td>Type d'option</td>
                <td>Option choisie</td>
                <td>Prix de l'option</td>
              </tr>
            </thead>
            <tbody>
              {data.estimate.map((e: any, i: number) => (
                <tr key={i}>
                  <td>{e.option.name}</td>
                  <td>{e.value.name}</td>
                  <td className="price">{e.value.price}</td>
                </tr>
              ))}
              <tr className="bg-lightgreen font-weight-bold">
                <td>Coût total des options</td>
                <td></td>
                <td className="price"> {data.total} </td>
              </tr>
            </tbody>
          </Table>
        )}
        <div className="circle1"></div>
        <div className="circle2"></div>
      </main>
    );
  }
}

export default withRouter(Estimate);
