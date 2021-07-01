import { Component } from 'react';
import { Col, Modal, Row, Table } from 'react-bootstrap';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ApiResponseError } from '../../../api/models';
import { apiRequest } from '../../../api/utils';
import { ConfigurationValue } from '../../../models';
import { EstimateProps, EstimateState } from './models';
import './estimate.css';

class Estimate extends Component<EstimateProps, EstimateState> {
  constructor(props: EstimateProps) {
    super(props);

    this.state = {
      data: null,
      error: null,
    };

    this.fetchEstimate = this.fetchEstimate.bind(this);
  }

  componentDidMount() {
    this.fetchEstimate();
  }

  async fetchEstimate(): Promise<void> {
    try {
      const data: ConfigurationValue[] = await apiRequest(
        `configuration/${this.props.confId}/estimate`,
        'GET',
        []
      );
      this.setState({
        data,
      });
    } catch (error) {
      this.setState({ error: error as ApiResponseError });
    }
  }

  render() {
    const { data } = this.state;

    return (
      <div className="p-5 w-100 bg-white configuration-infos">
        {data && (
          <div>
            <h2 className="text-green text-center">
              <FontAwesomeIcon icon={faCalculator} /> Devis détaillé
            </h2>
            <h6 className="text-center mt-2 mb-5">
              Le devis détaillé de la configuration avec le prix du modèle et
              des options sélectionnés.
            </h6>
            <Table bordered hover className="text-center my-4 mx-6">
              <thead>
                <tr>
                  <td>Type d'option</td>
                  <td>Option choisie</td>
                  <td>Prix de l'option</td>
                </tr>
              </thead>
              <tbody>
                {data?.houseModel && (
                  <tr>
                    <td>Modèle</td>
                    <td>{data.houseModel.name}</td>
                    <td className="price">{data.houseModel.price}</td>
                  </tr>
                )}
                {data?.estimate?.map((e: any, i: number) => (
                  <tr key={i}>
                    <td>{e.option.name}</td>
                    <td>{e.value.name}</td>
                    <td className="price">{e.value.price}</td>
                  </tr>
                ))}
                <tr className="bg-lightgreen font-weight-bold">
                  <td>Coût total des options</td>
                  <td></td>
                  <td className="price">{data.total}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        )}
        {this.state.error && (
          <Modal
            show={!!this.state.error}
            onHide={() => this.setState({ error: null })}
          >
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
      </div>
    );
  }
}

export default Estimate;
