import {
  faHome,
  faSave,
  faTimes,
  faKeyboard,
  faImage,
  faEuroSign,
  faUsers,
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
import { HouseModelEditProps, HouseModelEditState } from './models';
import './house-model-edit.css';
import { Asset, HouseModel, ModelType } from '../../../models';

class HouseModelEdit extends React.Component<
  HouseModelEditProps,
  HouseModelEditState
> {
  private schema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Le nom doit faire plus de 1 charactères')
      .required('Le nom ne peut pas être vide'),
    price: Yup.number()
      .min(0, 'Le prix doit être positif')
      .max(10000000, 'Le prix ne peut pas dépasser 10000000€')
      .required('Le prix ne peut pas être vide'),
    occupants: Yup.number()
      .min(0, "Le nombre d'habitants doit être positif")
      .max(50, "Le nombre d'habitants ne peut pas dépasser 50")
      .required("Le nombre d'habitants ne peut pas être vide"),
    id_ModelType: Yup.lazy(() =>
      Yup.number().oneOf(
        [...this.state.modelTypes.map((type) => type.id)],
        'Le type ne peut pas être vide'
      )
    ),
    id_Asset: Yup.lazy(() =>
      Yup.number().oneOf(
        [...this.state.assets.map((asset) => asset.id)],
        "L'asset ne peut pas être vide"
      )
    ),
  });

  private initialItem: HouseModel = {
    id: 0,
    name: '',
    occupants: 0,
    price: 0,
    id_ModelType: 0,
    id_Asset: 0,
  };

  constructor(props: HouseModelEditProps) {
    super(props);

    this.fetchHouseModel = this.fetchHouseModel.bind(this);
    this.fetchAssets = this.fetchAssets.bind(this);
    this.fetchModelTypes = this.fetchModelTypes.bind(this);
    this.submitForm = this.submitForm.bind(this);

    const id = parseInt(props.match.params.id ?? 0);

    this.state = {
      editMode: id !== 0,
      item: { ...this.initialItem, id },
      modelTypes: [],
      assets: [],
      error: undefined,
    };
  }

  componentDidMount() {
    this.fetchAssets();
    this.fetchModelTypes();
    if (this.state.editMode) {
      this.fetchHouseModel();
    }
  }

  async fetchHouseModel(): Promise<void> {
    apiRequest(`houseModel/${this.state.item.id}`, 'GET', [])
      .then((response) => {
        if (response.status === 'error') {
          this.setState({ error: response as ApiResponseError });
        } else {
          this.setState({ item: response as HouseModel });
        }
      })
      .catch((error) => console.log(error));
  }

  async fetchModelTypes(): Promise<void> {
    apiRequest(`modelType`, 'GET', [])
      .then((response) => {
        if (response.status === 'error') {
          this.setState({ error: response as ApiResponseError });
        } else {
          this.setState({ modelTypes: response as ModelType[] });
        }
      })
      .catch((error) => console.log(error));
  }

  async fetchAssets(): Promise<void> {
    apiRequest(`asset`, 'GET', [])
      .then((response) => {
        if (response.status === 'error') {
          this.setState({ error: response as ApiResponseError });
        } else {
          this.setState({ assets: response.items as Asset[] });
        }
      })
      .catch((error) => console.log(error));
  }

  async submitForm(values: HouseModel): Promise<void> {
    const { editMode } = this.state;

    (editMode
      ? apiRequest(`houseModel/${values.id}`, 'PUT', '', values)
      : apiRequest(`houseModel`, 'POST', '', values)
    )
      .then((response) => {
        if (response.status === 'error') {
          this.setState({ error: response as ApiResponseError });
        } else {
          this.props.history.push('/houseModels');
        }
      })
      .catch((error) => console.log(error));
  }

  render() {
    const { item, editMode, modelTypes, assets, error } = this.state;
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
          <h3 className="mb-5">
            <FontAwesomeIcon className="mr-2" icon={faHome} />
            {editMode ? 'Editer' : 'Ajouter'} un modèle
          </h3>
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
                  <Col md={4} sm={12}>
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
                  </Col>
                  <Col md={4} sm={12}>
                    <InputGroup className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="ModelIcon">
                          <FontAwesomeIcon icon={faHome} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder="Type de modèle"
                        name="id_ModelType"
                        as="select"
                        value={values.id_ModelType}
                        onChange={(e) => handleChange(e)}
                        isInvalid={!!(submitCount > 0 && errors.id_ModelType)}
                      >
                        <option value={0}>Choisir un type</option>
                        {modelTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </FormControl>
                      <Form.Control.Feedback type="invalid">
                        {errors.id_ModelType}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Col>
                  <Col md={4} sm={12}>
                    <InputGroup className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="ModelIcon">
                          <FontAwesomeIcon icon={faImage} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder="Asset"
                        name="id_Asset"
                        as="select"
                        value={values.id_Asset}
                        onChange={(e) => handleChange(e)}
                        isInvalid={!!(submitCount > 0 && errors.id_Asset)}
                      >
                        <option value={0}>Choisir un asset</option>
                        {assets.map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.value}
                          </option>
                        ))}
                      </FormControl>
                      <Form.Control.Feedback type="invalid">
                        {errors.id_Asset}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Col>
                  <Col md={6} sm={12}>
                    <InputGroup className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="UsersIcon">
                          <FontAwesomeIcon icon={faUsers} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        type="number"
                        placeholder="Habitants"
                        name="occupants"
                        value={values.occupants}
                        onChange={(e) => handleChange(e)}
                        isInvalid={!!(submitCount > 0 && errors.occupants)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.occupants}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Col>
                  <Col md={6} sm={12}>
                    <InputGroup className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="PriceIcon">
                          <FontAwesomeIcon icon={faEuroSign} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        type="number"
                        placeholder="Prix"
                        name="price"
                        value={values.price}
                        onChange={(e) => handleChange(e)}
                        isInvalid={!!(submitCount > 0 && errors.price)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.price}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Col>
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

export default withRouter(HouseModelEdit);
