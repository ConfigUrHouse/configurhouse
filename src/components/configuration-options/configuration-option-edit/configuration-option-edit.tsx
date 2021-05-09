import {
  faHome,
  faSave,
  faTimes,
  faKeyboard,
  faCube,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import React from "react";
import {
  Button,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useParams, withRouter } from "react-router";
import * as Yup from "yup";
import { ApiResponseError } from "../../../api/models";
import { apiRequest } from "../../../api/utils";
import {
  ConfigurationOptionEditProps,
  ConfigurationOptionEditState,
} from "./models";
import { ConfigurationOption, HouseModel, Mesh } from "../../../models";
import "./configuration-option-edit.css";
import { PaginatedResponse } from "../../../utils/pagination";

class ConfigurationOptionEdit extends React.Component<
  ConfigurationOptionEditProps,
  ConfigurationOptionEditState
> {
  private schema = Yup.object().shape({
    name: Yup.string()
      .min(4, "Le nom doit faire plus de 3 charactères")
      .required("Le nom ne peut pas être vide"),
    id_HouseModel: Yup.lazy(() =>
      Yup.number().oneOf(
        [...this.state.houseModels.map((houseModel) => houseModel.id)],
        "Le modèle ne peut pas être vide"
      )
    ),
    id_Mesh: Yup.lazy(() =>
      Yup.number().oneOf(
        [...this.state.meshes.map((mesh) => mesh.id)],
        "Le mesh ne peut pas être vide"
      )
    ),
  });

  private initialItem: ConfigurationOption = {
    id: 0,
    name: "",
    id_HouseModel: 0,
    id_Mesh: 0,
  };

  constructor(props: ConfigurationOptionEditProps) {
    super(props);

    this.fetchConfigurationOption = this.fetchConfigurationOption.bind(this);
    this.fetchHouseModels = this.fetchHouseModels.bind(this);
    this.fetchMeshes = this.fetchMeshes.bind(this);
    this.submitForm = this.submitForm.bind(this);

    const id = parseInt(props.match.params.id ?? 0);

    this.state = {
      editMode: id !== 0,
      item: { ...this.initialItem, id },
      houseModels: [],
      meshes: [],
      error: undefined,
    };
  }

  componentDidMount() {
    this.fetchHouseModels();
    this.fetchMeshes();
    if (this.state.editMode) {
      this.fetchConfigurationOption();
    }
  }

  async fetchConfigurationOption(): Promise<void> {
    try {
      const response: ConfigurationOption = await apiRequest(
        `optionConf/${this.state.item.id}`,
        "GET",
        []
      );
      this.setState({ item: response });
    } catch (error: any) {
      console.error(error);
      this.setState({ error: error as ApiResponseError });
    }
  }

  async fetchMeshes(): Promise<void> {
    try {
      const response: Mesh[] = await apiRequest(`mesh`, "GET", []);
      this.setState({ meshes: response });
    } catch (error: any) {
      console.error(error);
      this.setState({ error: error as ApiResponseError });
    }
  }

  async fetchHouseModels(): Promise<void> {
    try {
      const response: PaginatedResponse<HouseModel> = await apiRequest(
        `houseModel`,
        "GET",
        []
      );
      this.setState({ houseModels: response.items });
    } catch (error: any) {
      console.error(error);
      this.setState({ error: error as ApiResponseError });
    }
  }

  async submitForm(values: ConfigurationOption): Promise<void> {
    try {
      const { editMode } = this.state;

      await (editMode
        ? apiRequest(`optionConf/${values.id}`, "PUT", "", values)
        : apiRequest(`optionConf`, "POST", "", values));

      this.props.history.push("/configurationOptions");
    } catch (error) {
      console.error(error);
      this.setState({ error: error as ApiResponseError });
    }
  }

  render() {
    const { item, editMode, houseModels, meshes, error } = this.state;
    console.table(houseModels);
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
            {editMode ? "Editer" : "Ajouter"} une option
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
                        placeholder="Modèle"
                        name="id_HouseModel"
                        as="select"
                        value={values.id_HouseModel}
                        onChange={(e) => handleChange(e)}
                        isInvalid={!!(submitCount > 0 && errors.id_HouseModel)}
                      >
                        <option value={0}>Choisir un modèle</option>
                        {houseModels.map((houseModel) => (
                          <option key={houseModel.id} value={houseModel.id}>
                            {houseModel.name}
                          </option>
                        ))}
                      </FormControl>
                      <Form.Control.Feedback type="invalid">
                        {errors.id_HouseModel}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Col>
                  <Col md={4} sm={12}>
                    <InputGroup className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="ModelIcon">
                          <FontAwesomeIcon icon={faCube} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder="Asset"
                        name="id_Mesh"
                        as="select"
                        value={values.id_Mesh}
                        onChange={(e) => handleChange(e)}
                        isInvalid={!!(submitCount > 0 && errors.id_Mesh)}
                      >
                        <option value={0}>Choisir un mesh</option>
                        {meshes.map((mesh) => (
                          <option key={mesh.id} value={mesh.id}>
                            {mesh.name}
                          </option>
                        ))}
                      </FormControl>
                      <Form.Control.Feedback type="invalid">
                        {errors.id_Mesh}
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

export default withRouter(ConfigurationOptionEdit);
