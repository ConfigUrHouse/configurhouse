import React from 'react';
import ModelChoice from './model-choice/model-choice';
import ModelConfiguration from './model-configuration/model-configuration';
import Consommation from './consommation/consommation';
import Estimate from './estimate/estimate';
import { Col, Row, Button } from 'react-bootstrap';
import './configurator.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowCircleLeft,
  faArrowCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { ICurrent } from '../../types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { apiRequest } from '../../api/utils';
import { Configuration } from '../../models';

class Configurator extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    const id = parseInt(props.match.params.id ?? 0);

    const existingState = props.location.state || {};

    this.state = {
      model: null,
      modelSelected: null,
      step: 0,
      optionValues: [2, 4], //TODO: use values from state
      id,
      ...existingState,
    };

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.changeModelChoice = this.changeModelChoice.bind(this);
  }

  async componentDidMount() {
    if (this.state.id) {
      await this.fetchConfiguration();
      this.setState({ step: 1 });
    }
  }

  async fetchConfiguration(confId: number | null = null) {
    const id = confId || this.state.id;
    try {
      const item: Configuration = await apiRequest(
        `configuration/${id}`,
        'GET',
        []
      );
      this.setState({
        model: item.houseModel,
        optionValues: item.configurationValues?.map((cv) => cv.id_Value) ?? [],
        id,
      });
    } catch (error: any) {
      console.error(error);
      this.setState({ error });
    }
  }

  changeModelChoice(model: any) {
    this.setState({ modelSelected: model });
  }

  async next() {
    if (this.state.step == 0) {
      this.setState({ model: this.state.modelSelected });
      console.log(this.state.model);
    } else if (this.state.step == 1) {
      if (!this.props.isAuthenticated) {
        this.props.history.push('/login', {
          from: '/config',
          state: this.state,
        });
      } else {
        try {
          const { id, model, optionValues: configurationValues } = this.state;
          if (id) {
            await apiRequest(`configuration/${id}`, 'PUT', '', {
              configurationValues,
              id_HouseModel: model.id,
            });
          } else {
            console.log('id', id);
            await apiRequest('configuration', 'POST', '', {
              configurationValues,
              id_HouseModel: model.id,
            }).then(
              async ({ config }) =>
                await this.fetchConfiguration(config.id as number)
            );
          }
        } catch (error) {
          console.log(error);
          this.setState({ error });
        }
      }
    } else if (this.state.step == 2) {
    }
    this.setState({ step: this.state.step + 1 });
  }

  previous() {
    this.setState({ step: this.state.step - 1 });
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
      <main className="configurator p-5 w-100">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="timeline">
          <div className={`step ${this.state.step == 0 ? 'active' : ''}`}>
            <span>1</span>Choix
          </div>
          <div className="line">
            <hr />
          </div>
          <div className={`step ${this.state.step == 1 ? 'active' : ''}`}>
            <span>2</span>Configuration
          </div>
          <div className="line">
            <hr />
          </div>
          <div className={`step ${this.state.step == 2 ? 'active' : ''}`}>
            <span>3</span>Devis détaillé
          </div>
          <div className="line">
            <hr />
          </div>
          <div className={`step ${this.state.step == 3 ? 'active' : ''}`}>
            <span>4</span>Consommation
          </div>
          <div className="line">
            <hr />
          </div>
          <div className={`step ${this.state.step == 4 ? 'active' : ''}`}>
            <span>5</span>Validation
          </div>
        </div>
        <h5 className="mb-1">{stepName[this.state.step]}</h5>
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
          />
        )}
        {this.state.step == 2 && <Estimate confId={this.state.id as number} />}
        {this.state.step == 3 && (
          <Consommation
            optionValues={this.state.optionValues}
            houseModelId={this.state.model.id}
          />
        )}
        <Row className="justify-content-end">
          <Col md={2} className="col next">
            <div className="content">
              <Button className="mt-0" onClick={this.previous}>
                PRECEDENT <FontAwesomeIcon icon={faArrowCircleLeft} size="lg" />
              </Button>
            </div>
          </Col>
          <Col md={2} className="col next">
            <div className="content">
              <Button className="mt-0" onClick={this.next}>
                SUIVANT <FontAwesomeIcon icon={faArrowCircleRight} size="lg" />
              </Button>
            </div>
          </Col>
        </Row>
      </main>
    );
  }
}

const mapStateToProps = (state: ICurrent) => ({
  isAuthenticated: state.isAuthenticated,
});

export default connect(mapStateToProps)(withRouter(Configurator));
