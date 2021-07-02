import {
  faHome,
  faSave,
  faTimes,
  faKeyboard,
  faArrowCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik } from 'formik';
import React from 'react';
import {
  Button,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
} from 'react-bootstrap';
import { withRouter } from 'react-router';
import * as Yup from 'yup';
import { ApiResponseError } from '../../../api/models';
import { apiRequest } from '../../../api/utils';
import {
  UserConfigurationEditProps,
  UserConfigurationEditState,
} from './models';
import './user-configuration-edit.css';
import { Configuration } from '../../../models';

class HouseModelEdit extends React.Component<
  UserConfigurationEditProps,
  UserConfigurationEditState
> {
  private schema = Yup.object().shape({
    name: Yup.string()
      .min(4, 'Le nom doit faire plus de 3 charactères')
      .required('Le nom ne peut pas être vide'),
  });

  private initialItem: Configuration = {
    id: 0,
    name: '',
    id_User: 0,
    id_HouseModel: 0,
  };

  constructor(props: UserConfigurationEditProps) {
    super(props);

    this.fetchConfiguration = this.fetchConfiguration.bind(this);
    this.submitForm = this.submitForm.bind(this);

    const id = parseInt(props.match.params.id ?? 0);

    this.state = {
      item: { ...this.initialItem, id },
      error: undefined,
    };
  }

  componentDidMount() {
    this.fetchConfiguration();
  }

  async fetchConfiguration(): Promise<void> {
    apiRequest(`configuration/${this.state.item.id}`, 'GET', [])
      .then((response) => {
        if (response.status === 'error') {
          this.setState({ error: response as ApiResponseError });
        } else {
          this.setState({ item: response as Configuration });
        }
      })
      .catch((error) => console.log(error));
  }

  async submitForm(values: Configuration): Promise<void> {
    const configurationValues =
      values.configurationValues?.map((cv) => cv.id_Value) ?? [];
    apiRequest(`configuration/${values.id}`, 'PUT', '', {
      ...values,
      configurationValues,
    })
      .then((response) => {
        if (response.status === 'error') {
          this.setState({ error: response as ApiResponseError });
        } else {
          this.props.history.push('/account?tab=configs');
        }
      })
      .catch((error) => console.log(error));
  }

  render() {
    const { item, error } = this.state;
    return (
      <main className="p-5 w-100 bg">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="p-5 form w-75 mx-auto">
          {error && (
            <div className="alert alert-danger m-4">
              <FontAwesomeIcon icon={faTimes} />
              Une erreur est survenue :<p>Message : {error.message}</p>
            </div>
          )}
          <div className="mb-5 d-flex justify-content-between align-items-center">
            <h3>
              <FontAwesomeIcon className="mr-2" icon={faHome} />
              Editer une configuration
            </h3>
            <Button
              variant="primary"
              className="p-3"
              href={`${process.env.REACT_APP_BASE_URL}/config/${item.id}`}
            >
              Reprendre la configuration
              <FontAwesomeIcon className="ml-2" icon={faArrowCircleRight} />
            </Button>
          </div>
          <Formik
            validationSchema={this.schema}
            onSubmit={(values) => {
              this.submitForm(values);
            }}
            initialValues={item}
            enableReinitialize
            validateOnMount={true}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              errors,
              isValid,
              submitCount,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col sm={12}>
                    <InputGroup className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="NameIcon">
                          <FontAwesomeIcon icon={faKeyboard} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder="Nom"
                        name="name"
                        value={values.name}
                        onChange={(e) => handleChange(e)}
                        isInvalid={!!(submitCount > 0 && errors.name)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Col>{' '}
                </Row>
                <Button
                  variant="primary"
                  className="d-block mx-auto mt-3 p-3"
                  type="submit"
                  disabled={submitCount > 0 && !isValid}
                >
                  SAUVEGARDER <FontAwesomeIcon className="ml-2" icon={faSave} />
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    );
  }
}

export default HouseModelEdit;
