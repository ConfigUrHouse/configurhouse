import {
  faHome,
  faSave,
  faTimes,
  faKeyboard,
  faCube,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Field, Form as Form2, ErrorMessage, FieldArray } from "formik";
import React from "react";
import {
  Button,
  Col,
  Form,
  FormControl,
  Table,
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
import { addListener } from "process";

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
    houseModel: undefined,
    id_Mesh: 0,
    values: [
    ],
  };

  constructor(props: ConfigurationOptionEditProps) {
    super(props);

    this.fetchConfigurationOption = this.fetchConfigurationOption.bind(this);
    this.fetchValues = this.fetchValues.bind(this);
    this.fetchMeshes = this.fetchMeshes.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.removeValue = this.removeValue.bind(this);

    const id = parseInt(props.match.params.id ?? 0);

    this.state = {
      id: id,
      editMode: id !== 0,
      item: { ...this.initialItem, id },
      houseModel: undefined,
      houseModels: [],
      meshes: [],
      error: undefined,
    };
  }

  componentDidMount() {
    this.fetchMeshes();
    this.fetchValues();
  }

  async fetchConfigurationOption(): Promise<void> {
    try {
      const response: ConfigurationOption = await apiRequest(
        `optionConf/${this.state.item.id}`,
        "GET",
        []
      );
      this.setState({ item: { ...response, values: this.state.item.values } });
    } catch (error: any) {
      console.error(error);
      this.setState({ error: error as ApiResponseError });
    }
  }

  async removeValue(index: number): Promise<void> {
    try {
      await apiRequest(`value/${index}`, "DELETE", []);
    } catch (error: any) {
      console.error(error);
      this.setState({ error: error as ApiResponseError });
    }
  }

  async fetchValues(): Promise<void> {
    try {
      const response: Mesh[] = await apiRequest(`value/byOption/${this.state.id}`, "GET", []);
      this.setState({ item: { ...this.state.item, values: response } });
    } catch (error: any) {
      console.error(error);
      this.setState({ error: error as ApiResponseError });
    }
  }

  async fetchMeshes(): Promise<void> {
    if (this.state.editMode) {
      await this.fetchConfigurationOption();
    }
    let source: any = [];

    try {
      const response: PaginatedResponse<HouseModel> = await apiRequest(
        `houseModel`,
        "GET",
        []
      );
      await this.setState({ houseModels: response.items });
      source = response.items;

      if (this.state.item.id_HouseModel) {
        const hm: any = source.filter((element: any) => {
          return element.id == this.state.item.id_HouseModel
        });
        const response: any = await apiRequest(`mesh/by/${hm[0].id_Asset}`, "GET", []);
        this.setState({ meshes: response });
      }

    } catch (error: any) {
      console.error(error);
      this.setState({ error: error as ApiResponseError });
    }

  }

  async submitForm(values: ConfigurationOption): Promise<void> {
    try {
      const { editMode } = this.state;

      const reponse = await (editMode
        ? apiRequest(`optionConf/${values.id}`, "PUT", "", values)
        : apiRequest(`optionConf`, "POST", "", values));

      if(values.values && values.values.length > 0){
        const ms: any = this.state.meshes.filter((element2: any) => {
          return element2.id == values.id_Mesh
        })[0];

        await Promise.allSettled(values?.values.map(async (element: any) => {
          element.id_Asset = ms.id_Asset;
          element.id_OptionConf = reponse.id;
          return (element.id
            ? apiRequest(`value/${element.id}`, "PUT", "", element)
            : apiRequest(`value`, "POST", "", element));
        }));
      }
  

    } catch (error) {
      console.error(error);
      this.setState({ error: error as ApiResponseError });
    }

    //this.props.history.push('/configurationOptions');
  }

  render() {
    const { item, editMode, houseModels, meshes, error } = this.state;
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
              <>
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
                          onChange={async (e) => {
                            handleChange(e)
                            const response: any = this.state.houseModels.filter((element: any) => {
                              return element.id == e.target.value
                            })
                            const reponse2 = await apiRequest(`mesh/by/${response[0].id_Asset}`, "GET", []);

                            this.setState({ houseModel: response[0] });
                            this.setState({ meshes: reponse2 });
                            console.log(response)
                            console.log(reponse2)
                          }}
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
                  <Row>
                    <Col md={12}>
                      <FieldArray name="values">
                        {({ insert, remove, push }) => (
                          <>
                            <Table className="mt-4" striped bordered hover>
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Couleur</th>
                                  <th>Prix</th>
                                  <th>Supprimer</th>
                                </tr>
                              </thead>
                              <tbody>
                                {values.values.length > 0 &&
                                  values.values.map((friend: any, index: any) => (
                                    <tr>
                                      <td>
                                        {values.values[index].id}
                                      </td>
                                      <td>
                                        <InputGroup className="mb-3">
                                          <InputGroup.Prepend>
                                            <InputGroup.Text id="ModelIcon">
                                              <FontAwesomeIcon icon={faHome} />
                                            </InputGroup.Text>
                                          </InputGroup.Prepend>
                                          <FormControl
                                            placeholder="Nom"
                                            name={`values.${index}.value`}
                                            value={values.values[index].value}
                                            onChange={(e) => handleChange(e)}
                                            isInvalid={!!(submitCount > 0 && errors.name)}
                                            as="select"
                                          >
                                            <option value={0}>Choisir une couleur</option>
                                            <option key={1} value={"#D36135"}>
                                              Flame
                                            </option>
                                            <option key={2} value={"#A24936"}>
                                              Chestnut
                                            </option>
                                            <option key={3} value={"#282B28"}>
                                              Charleston Green
                                            </option>
                                            <option key={4} value={"#83BCA9"}>
                                              Green Sheen
                                            </option>
                                            <option key={5} value={"#3E5641"}>
                                              Hunter Green
                                            </option>
                                            <option key={6} value={"#003459"}>
                                              Prussion Blue
                                            </option>
                                            <option key={7} value={"#00171F"}>
                                              Rich Black FOGRA 29
                                            </option>
                                            <option key={8} value={"#FFFFFF"}>
                                              White
                                            </option>
                                            <option key={9} value={"#DAD6D6"}>
                                              Ligth Gray
                                            </option>
                                          </FormControl>
                                          <Form.Control.Feedback type="invalid">
                                            {errors.id_HouseModel}
                                          </Form.Control.Feedback>
                                        </InputGroup>
                                      </td>
                                      <td>
                                        <InputGroup className="mb-3">
                                          <InputGroup.Prepend>
                                            <InputGroup.Text id="NameIcon">
                                              <FontAwesomeIcon icon={faKeyboard} />
                                            </InputGroup.Text>
                                          </InputGroup.Prepend>
                                          <FormControl
                                            type="number"
                                            placeholder="Price"
                                            name={`values.${index}.price`}
                                            value={values.values[index].price}
                                            onChange={(e) => handleChange(e)}
                                            isInvalid={!!(submitCount > 0 && errors.name)}
                                          />
                                          <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                          </Form.Control.Feedback>
                                        </InputGroup>
                                      </td>
                                      <td>
                                        <Button
                                          type="button"
                                          className="secondary"
                                          onClick={async () => {
                                            await this.removeValue(values.values[index].id);
                                            remove(index)
                                          }}
                                        >
                                          <FontAwesomeIcon className="ml-2" icon={faTrash} />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}

                              </tbody>
                            </Table>
                            <Button
                              type="button"
                              className="secondary"
                              onClick={() => push({ "name": "White", "value": "#FFFFFF", "price": "1054.00", "is_default": 0, "id_OptionConf": this.state.id, "id_Asset": null })}
                            >
                              Ajouter
                            </Button>
                          </>
                        )}
                      </FieldArray>
                    </Col>
                  </Row>
                  <Row>
                  <Button
                    variant="primary"
                    className="mx-auto mt-3 p-3"
                    type="submit"
                    disabled={submitCount > 0 && !isValid}
                  >
                    SAUVEGARDER <FontAwesomeIcon className="ml-2" icon={faSave} />
                  </Button>
                  <Button
                    onClick={() => this.props.history.push('/configurationOptions')}
                    className="mx-auto mt-3 p-3"
                  >
                    RETOUR
                  </Button>
                  </Row>
                  
                </Form>
              </>
            )}
          </Formik>
        </div>
      </main>
    );
  }
}

export default withRouter(ConfigurationOptionEdit);
