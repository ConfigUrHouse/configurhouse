import React from 'react';
import { ApiResponseError } from '../../../api/models';
import { Col, Row, Table } from 'react-bootstrap';
import './model-choice.css';
import { apiRequest } from '../../../api/utils';
class ModelChoice extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.fetchHouseModels = this.fetchHouseModels.bind(this);
    this.state = { modelSelected: null, models: [] };
  }

  selectModel(model: any) {
    this.setState({ modelSelected: model });
    this.props.onChange(model);
  }

  componentDidMount() {
    this.fetchHouseModels();
  }

  // Loads the list of house models
  async fetchHouseModels(): Promise<void> {
    apiRequest(`houseModel`, 'GET', [])
      .then((response) => {
        if (response.status === 'error') {
          this.setState({ error: response as ApiResponseError });
        } else {
          this.setState({
            models: response.items,
            modelSelected: response.items[0],
          });
          this.props.onChange(this.state.modelSelected);
        }
      })
      .catch((error) => console.log(error));
  }

  render() {
    const { models } = this.state;
    return (
      <div className='models-choice'>
        <Row>
          {models.map((item: any) => {
            return (
              <Col key={item.id}>
                <div
                  className={`model ${
                    this.state.modelSelected == item ? 'selected' : ''
                  }`}
                  onClick={(e) => this.selectModel(item)}
                >
                  <h4>Modèle {item.name}</h4>
                  <Table bordered hover className='mt-5 text-center'>
                    <thead>
                      <tr>
                        <th colSpan={2}>
                          Caractéristique du modèle {item.name}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='sub'>
                        <td colSpan={2}>Informations</td>
                      </tr>
                      <tr>
                        <td>Nombre d'occupants</td>
                        <td>{item.occupants}</td>
                      </tr>
                      <tr>
                        <td>Prix de base</td>
                        <td className='price'>{item.price}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}

export default ModelChoice;
