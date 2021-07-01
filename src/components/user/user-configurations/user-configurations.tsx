import React from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCogs,
  faPlus,
  faKeyboard,
  faHome,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { ItemsTableColumn } from '../../templates/items-table/models';
import { Formik } from 'formik';
import {
  Button,
  Form,
  FormControl,
  InputGroup,
  Row,
  Col,
} from 'react-bootstrap';
import { ItemsTable } from '../../templates/items-table/items-table';
import * as Yup from 'yup';
import {
  emptyPaginatedData,
  PaginatedResponse,
} from '../../../utils/pagination';
import { apiRequest } from '../../../api/utils';
import { Configuration, HouseModel } from '../../../models';
import {
  UserConfigurationsFormValues,
  UserConfigurationsProps,
  UserConfigurationsState,
} from './models';
import './user-configurations.css';

class UserConfigurations extends React.Component<
  UserConfigurationsProps,
  UserConfigurationsState
> {
  private initialValues: UserConfigurationsFormValues = {
    name: '',
    houseModelId: 0,
  };

  private schema = Yup.object().shape({
    name: Yup.string().min(2, 'Trop court !'),
    houseModelId: Yup.lazy(() =>
      Yup.number().oneOf([
        ...this.state.houseModels.map((houseModel) => houseModel.id),
        0,
      ])
    ),
  });

  private columns: ItemsTableColumn<Configuration>[] = [
    {
      name: 'id',
      displayName: 'ID',
    },
    {
      name: 'name',
      displayName: 'Nom',
    },
    {
      name: 'houseModel',
      displayName: 'Modèle',
      component(item) {
        return item.houseModel?.name ?? 'Inconnu';
      },
    },
  ];

  constructor(props: UserConfigurationsProps) {
    super(props);
    this.fetchHouseModels = this.fetchHouseModels.bind(this);
    this.fetchConfigurations = this.fetchConfigurations.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSeeMore = this.handleSeeMore.bind(this);

    this.state = {
      houseModels: [],
      formValues: { ...this.initialValues },
      paginatedItems: emptyPaginatedData<Configuration>(),
    };
  }

  componentDidMount() {
    this.fetchHouseModels();
    this.fetchConfigurations();
  }

  async fetchHouseModels() {
    try {
      const paginatedHouseModels: PaginatedResponse<HouseModel> =
        await apiRequest('houseModel', 'GET');

      this.setState({ houseModels: paginatedHouseModels.items });
    } catch (error) {
      this.setState({ houseModels: [] });
    }
  }

  async fetchConfigurations() {
    const {
      paginatedItems: { currentPage },
      formValues,
    } = this.state;

    const queryParams = [`page=${currentPage}`, `size=10`];
    if (formValues.name) {
      queryParams.push(`name=${formValues.name}`);
    }
    if (formValues.houseModelId) {
      queryParams.push(`id_HouseModel=${formValues.houseModelId}`);
    }

    try {
      const paginatedItems: PaginatedResponse<Configuration> = await apiRequest(
        'configuration',
        'GET',
        queryParams
      );

      this.setState({ paginatedItems });
    } catch (error) {
      this.setState({ paginatedItems: emptyPaginatedData<Configuration>() });
    }
  }

  handleEdit(id: number): void {
    this.props.history.push(`config_edit/${id}`);
  }
  handleSeeMore(id: number): void {
    this.props.history.push(`configuration/${id}`);
  }
  private async handleDelete(id: number): Promise<void> {
    apiRequest(`configuration/${id}`, 'DELETE', [])
      .then((response) => {
        this.fetchConfigurations();
      })
      .catch((error) => console.log(error));
  }

  private deleteMessage(item: Configuration): string {
    return `Voulez-vous supprimer cette configuration (${item.houseModel?.name}) ?`;
  }

  handlePageChange(value: number) {
    const paginatedItems = { ...this.state.paginatedItems };
    paginatedItems.currentPage = value;

    this.setState(
      {
        paginatedItems,
      },
      this.fetchConfigurations
    );
  }

  render() {
    const {
      schema,
      initialValues,
      columns,
      state: { paginatedItems, houseModels },
    } = this;

    return (
      <main className="p-5 w-100 bg-white m-0 user-configurations">
        <h2 className="text-green text-center">
          <FontAwesomeIcon icon={faCogs} /> Mes configurations
        </h2>
        <h6 className="text-center mt-2 mb-5">
          Vous pouvez ici gérer vos configurations sauvegardées.
        </h6>
        <hr />

        <div>
          <div className="addNew">
            <Button variant="primary" href="/config">
              <FontAwesomeIcon className="mr-2" icon={faPlus} />
              AJOUTER
            </Button>
          </div>
          <Formik
            validationSchema={schema}
            onSubmit={this.fetchConfigurations}
            initialValues={initialValues}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              isValid,
              errors,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} sm={12}>
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
                        onChange={(e) => {
                          this.setState({
                            formValues: {
                              ...this.state.formValues,
                              name: e.target.value,
                            },
                          });
                          handleChange(e);
                        }}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Col>
                  <Col md={6} sm={12}>
                    <InputGroup className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="ModelIcon">
                          <FontAwesomeIcon icon={faHome} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control
                        placeholder="Modèle"
                        name="houseModelId"
                        as="select"
                        value={values.houseModelId}
                        onChange={(e) => {
                          this.setState({
                            formValues: {
                              ...this.state.formValues,
                              houseModelId: parseInt(e.target.value),
                            },
                          });
                          handleChange(e);
                        }}
                      >
                        <option value={0}>Choisir un modèle</option>
                        {houseModels.map((houseModel) => (
                          <option key={houseModel.id} value={houseModel.id}>
                            {houseModel.name}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.houseModelId}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Col>
                </Row>
                <Button variant="primary" type="submit">
                  RECHERCHER{' '}
                  <FontAwesomeIcon className="ml-2" icon={faSearch} />
                </Button>
              </Form>
            )}
          </Formik>

          <ItemsTable<Configuration>
            paginatedItems={paginatedItems}
            columns={columns}
            handlePageChange={this.handlePageChange}
            handleEdit={this.handleEdit}
            handleDelete={this.handleDelete}
            deleteMessage={this.deleteMessage}
            handleSeeMore={this.handleSeeMore}
          ></ItemsTable>
        </div>

        <div className="circle1"></div>
        <div className="circle2"></div>
      </main>
    );
  }
}

export default withRouter(UserConfigurations);
