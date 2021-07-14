import React from 'react';
import ModelChoice from './model-choice/model-choice';
import ModelConfiguration from './model-configuration/model-configuration';
import Consommation from './consommation/consommation';
import Estimate from './estimate/estimate';
import { Col, Row, Button, Modal } from 'react-bootstrap';
import './configurator.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faCheck,
  faMailBulk,
} from '@fortawesome/free-solid-svg-icons';
import { ICurrent } from '../../types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { apiRequest } from '../../api/utils';
import { Configuration } from '../../models';
import { ApiResponseError } from '../../api/models';

class Configurator extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    const id = parseInt(props.match.params.id ?? 0);

    const existingState = JSON.parse(
      localStorage.getItem('configuration_state') || '{}'
    );

    this.state = {
      model: null,
      modelSelected: null,
      step: 0,
      optionValues: [],
      id,
      has_furniture: true,
      configuration: {},
      error: null,
      configuration_sent: false,
      ...existingState,
    };

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.sendConfiguration = this.sendConfiguration.bind(this);
    this.changeModelChoice = this.changeModelChoice.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  async componentDidMount() {
    if (this.state.id) {
      await this.fetchConfiguration();
      this.setState({ step: 1 });
    }
  }

  private handleModalClose(): void {
    this.setState({ error: undefined });
  }

  // Loads the configuration
  async fetchConfiguration(confId: number | null = null) {
    const id = confId || this.state.id;
    try {
      const configuration: Configuration = await apiRequest(
        `configuration/${id}`,
        'GET',
        []
      );
      this.setState({
        model: configuration.houseModel,
        has_furniture: configuration.has_furniture,
        optionValues:
          configuration.configurationValues?.map((cv) => cv.id_Value) ?? [],
        id,
        configuration,
      });
    } catch (error: any) {
      console.error(error);
      this.setState({ error });
    }
  }

  private async sendConfiguration(): Promise<void> {
    try {
      const response = await apiRequest(
        `configuration/${this.state.id}/send`,
        'GET',
        []
      );
      if (response.status === 'error') {
        throw response;
      }

      this.setState({ configuration_sent: true });
    } catch (error) {
      this.setState({ error: error as ApiResponseError });
    }
  }

  changeModelChoice(model: any) {
    this.setState({ modelSelected: model });
  }

  // Saves the configuration
  async saveConfiguration() {
    try {
      const {
        id,
        model,
        has_furniture,
        configuration,
        optionValues: configurationValues,
      } = this.state;

      if (id) {
        await apiRequest(`configuration/${id}`, 'PUT', '', {
          ...configuration,
          has_furniture,
          configurationValues,
          id_HouseModel: model.id,
        });
      } else {
        await apiRequest('configuration', 'POST', '', {
          has_furniture,
          configurationValues,
          id_HouseModel: model.id,
        }).then(
          async ({ config }) =>
            await this.fetchConfiguration(config.id as number)
        );
      }
      localStorage.removeItem('configuration_state');
    } catch (error) {
      console.log(error);
      this.setState({ error });
    }
  }

  // Moves on to the next step and executes any specific actions if needed
  async next() {
    if (this.state.step == 0) {
      // Selects the model type on the first step
      this.setState({ model: this.state.modelSelected });
    } else if (this.state.step == 1) {
      // Moves the user to the login page if the user is not authenticated, otherwise saves the configuration
      if (!this.props.isAuthenticated) {
        localStorage.setItem('configuration_state', JSON.stringify(this.state));
        this.props.history.push('/login', {
          from: '/config',
        });
      } else {
        await this.saveConfiguration();
      }
    } else if (this.state.step == 2) {
    }
    this.setState({ step: this.state.step + 1 });
  }

  // Moves to the previous step
  previous() {
    this.setState({
      step: this.state.step - 1,
      configuration_sent:
        this.state.step < 3 ? false : this.state.configuration_sent,
    });
  }

  render() {
    const stepName = [
      'Choix du modèle',
      'Configurateur',
      'Devis détaillé',
      'Consommation',
      'Validation',
    ];
    return (
      <main className='configurator p-5 w-100'>
        <div className='circle1'></div>
        <div className='circle2'></div>
        <div className='timeline'>
          <div className={`step ${this.state.step == 0 ? 'active' : ''}`}>
            <span>1</span>Choix
          </div>
          <div className='line'>
            <hr />
          </div>
          <div className={`step ${this.state.step == 1 ? 'active' : ''}`}>
            <span>2</span>Configuration
          </div>
          <div className='line'>
            <hr />
          </div>
          <div className={`step ${this.state.step == 2 ? 'active' : ''}`}>
            <span>3</span>Devis détaillé
          </div>
          <div className='line'>
            <hr />
          </div>
          <div className={`step ${this.state.step == 3 ? 'active' : ''}`}>
            <span>4</span>Consommation
          </div>
          <div className='line'>
            <hr />
          </div>
          <div className={`step ${this.state.step == 4 ? 'active' : ''}`}>
            <span>5</span>Validation
          </div>
        </div>
        {this.state.step == 0 && (
          <ModelChoice
            model={this.state.model}
            onChange={this.changeModelChoice}
          />
        )}
        {this.state.step == 1 && (
          <ModelConfiguration
            model={this.state.model}
            optionValues={this.state.optionValues}
            updateOptionValues={(optionValues: number[]) => {
              this.setState({ optionValues });
            }}
            hasFurniture={this.state.has_furniture}
            updateHasFurniture={(has_furniture: boolean) =>
              this.setState({ has_furniture })
            }
          />
        )}
        {this.state.step == 2 && <Estimate confId={this.state.id as number} />}
        {this.state.step == 3 && (
          <Consommation
            optionValues={this.state.optionValues}
            houseModelId={this.state.model.id}
          />
        )}
        {this.state.step == 4 && (
          <div className='content CanvaContainer mt-5'>
            <h3 className='text-center mt-5'>
              Bravo, votre futur logement est maintenant configuré !
            </h3>
            <p className='text-center mt-4 text-green'>
              Une fois votre configuration envoyée à l'aide du bouton
              ci-dessous,<br></br>nous vous rappelerons dès que possible afin de
              discuter de votre futur logement ensemble.
            </p>

            <div className='rect'>
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

              <div className='d-flex justify-content-center mt-4'>
                {this.state.configuration_sent ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className='d-block mx-auto text-green check-icon'
                  />
                ) : (
                  <Button
                    variant='primary'
                    className='p-3'
                    onClick={this.sendConfiguration}
                  >
                    <FontAwesomeIcon className='mr-2' icon={faMailBulk} />
                    Envoyer ma configuration à Deschamps
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        <Row className='justify-content-end'>
          <Col md={3} className='col next'>
            <div className='content'>
              <Button className='mt-0' onClick={this.previous}>
                PRECEDENT{' '}
                <FontAwesomeIcon
                  icon={faArrowCircleLeft}
                  size='lg'
                  className='d-block mx-auto'
                />
              </Button>
            </div>
          </Col>
          {this.state.step <= 3 && (
            <Col md={3} className='col next'>
              <div className='content'>
                <Button className='mt-0' onClick={this.next}>
                  SUIVANT{' '}
                  <FontAwesomeIcon
                    icon={faArrowCircleRight}
                    size='lg'
                    className='d-block mx-auto'
                  />
                </Button>
              </div>
            </Col>
          )}
        </Row>
      </main>
    );
  }
}

const mapStateToProps = (state: ICurrent) => ({
  isAuthenticated: state.isAuthenticated,
});

export default connect(mapStateToProps)(withRouter(Configurator));
