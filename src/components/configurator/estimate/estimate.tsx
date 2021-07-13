import { Component } from 'react';
import { Modal, Table, Button } from 'react-bootstrap';
import { faCalculator, faDownload } from '@fortawesome/free-solid-svg-icons';
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
      modalIsOpen: false,
    };

    this.fetchEstimate = this.fetchEstimate.bind(this);
  }

  componentDidMount() {
    this.fetchEstimate();
  }

  // Loads the estimate data for the configuration
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
      <div className='p-5 w-100 bg-white configuration-infos'>
        <Modal
          show={!!this.state.modalIsOpen}
          onHide={() => this.setState({ modalIsOpen: false })}
        >
          <Modal.Header>
            <Modal.Title>Téléchargement de devis</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>En quel format voulez vous télécharger le devis ?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={() => this.setState({ modalIsOpen: false })}
            >
              Annuler
            </Button>
            <Button
              variant='primary'
              type='submit'
              href={`${process.env.REACT_APP_API_BASE_URL}/configuration/${this.props.confId}/estimate/download?mode=csv`}
              onClick={() => this.setState({ modalIsOpen: false })}
            >
              CSV
            </Button>
            <Button
              variant='primary'
              type='submit'
              href={`${process.env.REACT_APP_API_BASE_URL}/configuration/${this.props.confId}/estimate/download?mode=pdf`}
              onClick={() => this.setState({ modalIsOpen: false })}
            >
              PDF
            </Button>
          </Modal.Footer>
        </Modal>
        {data && (
          <div>
            <div className='estimate-title-container'>
              <h2 className='text-green text-center'>
                <FontAwesomeIcon icon={faCalculator} /> Devis détaillé
              </h2>
              <h6 className='text-center mt-2 mb-5'>
                Le devis détaillé de la configuration avec le prix du modèle et
                des options sélectionnés.
              </h6>
              <div className='download-estimate'>
                <Button
                  variant='primary'
                  onClick={() => this.setState({ modalIsOpen: true })}
                >
                  <FontAwesomeIcon className='mr-2' icon={faDownload} />
                  Télécharger
                </Button>
              </div>
            </div>
            <Table bordered hover className='text-center my-4 mx-6'>
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
                    <td className='price'>
                      {parseFloat(data.houseModel.price).toLocaleString(
                        'fr-FR'
                      )}
                    </td>
                  </tr>
                )}
                {data?.estimate?.map((e: any, i: number) => (
                  <tr key={i}>
                    <td>{e.option.name}</td>
                    <td>{e.value.name}</td>
                    <td className='price'>
                      {parseFloat(e.value.price).toLocaleString('fr-FR')}
                    </td>
                  </tr>
                ))}
                <tr className='bg-lightgreen font-weight-bold'>
                  <td>Coût total des options</td>
                  <td></td>
                  <td className='price'>
                    {parseFloat(data.total).toLocaleString('fr-FR')}
                  </td>
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
        <div className='circle1'></div>
        <div className='circle2'></div>
      </div>
    );
  }
}

export default Estimate;
