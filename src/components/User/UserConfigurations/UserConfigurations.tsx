import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { ItemsTableColumn } from "../../Templates/ItemsTable/Models";
import { Formik } from "formik";
import { Button, Form } from "react-bootstrap";
import { ItemsTable } from "../../Templates/ItemsTable/ItemsTable";
import * as Yup from "yup";
import {
  emptyPaginatedData,
  PaginatedResponse,
} from "../../../utils/pagination";
import { apiRequest } from "../../../api/utils";
import { Configuration, HouseModel } from "../../../models";
import {
  UserConfigurationsFormValues,
  UserConfigurationsState,
} from "./Models";

export default class UserConfigurations extends React.Component<
  {},
  UserConfigurationsState
> {
  private initialValues: UserConfigurationsFormValues = {
    name: "",
    houseModelId: 0,
  };

  private schema = Yup.object().shape({
    name: Yup.string().min(2, "Trop court !"),
    houseModelId: Yup.lazy(() =>
      Yup.number().oneOf([
        ...this.state.houseModels.map((houseModel) => houseModel.id),
        0,
      ])
    ),
  });

  private columns: ItemsTableColumn<Configuration>[] = [
    {
      name: "id",
      displayName: "ID",
    },
    {
      name: "name",
      displayName: "Nom",
    },
    {
      name: "houseModel",
      displayName: "Modèle",
      component(item) {
        return item.houseModel?.name ?? "Inconnu";
      },
    },
  ];

  constructor(props: {}) {
    super(props);
    this.fetchHouseModels = this.fetchHouseModels.bind(this);
    this.fetchConfigurations = this.fetchConfigurations.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

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
      const paginatedHouseModels: PaginatedResponse<HouseModel> = await apiRequest(
        "houseModel",
        "GET"
      );

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
        "configuration",
        "GET",
        queryParams
      );

      this.setState({ paginatedItems });
    } catch (error) {
      this.setState({ paginatedItems: emptyPaginatedData<Configuration>() });
    }
  }

  handleEdit(id: number) {
    console.log("Edit");
  }

  handleDelete(id: number) {
    console.log("Delete");
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
                <Form.Group>
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    id="name"
                    type="text"
                    placeholder="Entrez un nom"
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
                </Form.Group>
                <Form.Group>
                  <Form.Label>Modèle</Form.Label>
                  <Form.Control
                    id="houseModelId"
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
                </Form.Group>
                <Button variant="primary" type="submit">
                  Rechercher
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
          ></ItemsTable>
        </div>

        <div className="circle1"></div>
        <div className="circle2"></div>
      </main>
    );
  }
}
