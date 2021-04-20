import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Col,
  Form,
  FormControl,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import {
  faCheck,
  faEnvelope,
  faExclamationTriangle,
  faPaperPlane,
  faSearch,
  faTimes,
  faUser,
  faUserTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  emptyPaginatedData,
  PaginatedResponse,
} from "../../../utils/pagination";
import { UsersListState, FormValues, UserListProps } from "./Models";
import { apiRequest } from "../../../api/utils";
import { ItemsTableColumn } from "../../Templates/ItemsTable/Models";
import { ItemsTable } from "../../Templates/ItemsTable/ItemsTable";
import { Role, User } from "../Models";
import { withRouter } from "react-router";
import "./UserList.css";
import { ApiResponseError } from "../../../api/models";
import { EditorField } from "../../Templates/EditorField/EditorField";

const defaultRole = "Tous";

const initialValues: FormValues = {
  firstName: "",
  lastName: "",
  role: defaultRole,
};

const initialEmailValues = {
  subject: "",
  content: "",
  consent: false,
};

const columns: ItemsTableColumn<User>[] = [
  {
    name: "id",
    displayName: "ID",
  },
  {
    name: "lastname",
    displayName: "Nom",
  },
  {
    name: "firstname",
    displayName: "Prénom",
  },
  {
    name: "email",
    displayName: "Email",
  },
  {
    name: "active",
    displayName: "Vérifié",
    component(item) {
      return (
        <FontAwesomeIcon
          icon={item.active ? faCheck : faTimes}
          color={item.active ? "green" : "red"}
        />
      );
    },
  },
];

export class UserList extends React.Component<UserListProps, UsersListState> {
  constructor(props: UserListProps) {
    super(props);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEmailModalClose = this.handleEmailModalClose.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.fetchAllResults = this.fetchAllResults.bind(this);

    this.state = {
      formValues: initialValues,
      paginatedItems: emptyPaginatedData<User>(),
      roles: [],
      error: undefined,
      showEmailModal: false,
      selectedUsers: [],
    };
  }

  private searchSchema = Yup.object().shape({
    firstName: Yup.string().min(
      2,
      "Le prénom doit faire au moins 2 caractères"
    ),
    lastName: Yup.string().min(2, "Le nom doit faire au moins 2 caractères"),
    role: Yup.lazy(() =>
      Yup.string().oneOf([
        ...this.state.roles.map((role) => role.name),
        defaultRole,
      ])
    ),
  });

  private emailSchema = Yup.object().shape({
    object: Yup.string(),
    content: Yup.string().required("Veuillez saisir un message"),
    consent: Yup.bool().isTrue("Veuillez cocher cette case avant d'envoyer"),
  });

  componentDidMount() {
    this.fetchRoles();
    this.fetchUsers();
  }

  private async fetchRoles() {
    apiRequest("role", "GET", [])
      .then((response) => {
        if (response.status === "error") {
          this.setState({ error: response as ApiResponseError });
        } else {
          const roles = response as Role[];
          this.setState({ roles });
        }
      })
      .catch((error) => console.log(error));
  }

  private async fetchUsers() {
    const {
      paginatedItems: { currentPage },
      formValues,
    } = this.state;

    const queryParams = [`page=${currentPage}`, `size=10`];
    if (formValues.firstName) {
      queryParams.push(`firstname=${formValues.firstName}`);
    }
    if (formValues.lastName) {
      queryParams.push(`lastname=${formValues.lastName}`);
    }
    if (formValues.role && formValues.role !== defaultRole) {
      queryParams.push(`role=${formValues.role}`);
    }

    apiRequest("user", "GET", queryParams)
      .then((response) => {
        if (response.status === "error") {
          this.setState({ error: response as ApiResponseError });
        } else {
          const paginatedItems: PaginatedResponse<User> = response as PaginatedResponse<User>;
          this.setState({ paginatedItems });
        }
      })
      .catch((error) => console.log(error));

    this.setState({ paginatedItems: emptyPaginatedData<User>() });
  }

  private async fetchAllResults(): Promise<User[]> {
    const formValues = this.state.formValues;

    const queryParams = [];
    if (formValues.firstName) {
      queryParams.push(`firstname=${formValues.firstName}`);
    }
    if (formValues.lastName) {
      queryParams.push(`lastname=${formValues.lastName}`);
    }
    if (formValues.role && formValues.role !== defaultRole) {
      queryParams.push(`role=${formValues.role}`);
    }

    return apiRequest("user", "GET", queryParams)
      .then((response) => {
        if (response.status === "error") {
          this.setState({ error: response as ApiResponseError });
          return [];
        } else {
          const paginatedItems: PaginatedResponse<User> = response as PaginatedResponse<User>;
          return paginatedItems.items;
        }
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  }

  private handleEdit(id: number): void {
    let path = `user/${id}/edit`;
    this.props.history.push(path);
  }

  private async handleDelete(id: number): Promise<void> {
    return apiRequest(`user/${id}`, "DELETE", [])
      .then((response) => {
        if (response.status === "error") {
          this.setState({ error: response as ApiResponseError });
        } else {
          this.fetchUsers();
        }
      })
      .catch((error) => console.log(error));
  }

  private deleteMessage(item: User): string {
    return `Voulez-vous supprimer l'utilisateur ${item.firstname} ${item.lastname} (${item.email}) ?`;
  }

  private handlePageChange(value: number): void {
    const paginatedItems = { ...this.state.paginatedItems };
    paginatedItems.currentPage = value;

    this.setState(
      {
        paginatedItems,
      },
      () => {
        this.fetchUsers();
      }
    );
  }

  private handleEmailModalClose(): void {
    this.setState({ showEmailModal: false });
  }

  private async sendEmails(
    emailList: string[],
    subject: string,
    content: string
  ) {
    apiRequest(`utils/sendEmails`, "POST", [], {
      emails: emailList,
      subject: subject,
      content: content,
    })
      .then((response) => {
        if (response.status === "error") {
          this.setState({ error: response as ApiResponseError });
        }
        this.handleEmailModalClose();
      })
      .catch((error) => console.log(error));
  }

  render() {
    const { paginatedItems } = this.state;
    return (
      <main className="p-5 w-100 bg">
        <Modal
          show={this.state.showEmailModal}
          onHide={this.handleEmailModalClose}
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Envoyer un email</Modal.Title>
          </Modal.Header>
          <Formik
            validationSchema={this.emailSchema}
            onSubmit={(values) =>
              this.sendEmails(
                this.state.selectedUsers.map((user) => user.email),
                values.subject,
                values.content
              )
            }
            initialValues={initialEmailValues}
            enableReinitialize
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
                <Modal.Body>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUser} />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder="Objet"
                      name="subject"
                      value={values.subject}
                      onChange={handleChange}
                      isInvalid={!!errors.subject}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.subject}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <EditorField name="content" initialValue="<p></p>" />
                  <Form.Check>
                    <Form.Check.Input
                      name="consent"
                      checked={values.consent}
                      onChange={handleChange}
                      isInvalid={!!errors.consent}
                    />
                    <Form.Check.Label>
                      Envoyer un email à {this.state.selectedUsers.length}{" "}
                      utilisateur(s){" "}
                      <FontAwesomeIcon icon={faExclamationTriangle} />
                    </Form.Check.Label>
                  </Form.Check>
                  <Form.Control.Feedback type="invalid">
                    {errors.consent}
                  </Form.Control.Feedback>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={this.handleEmailModalClose}
                  >
                    Annuler
                  </Button>
                  <Button variant="primary" type="submit" disabled={!isValid}>
                    ENVOYER <FontAwesomeIcon icon={faPaperPlane} />
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="p-5 form w-75 mx-auto">
          {this.state.error && (
            <div className="alert alert-danger m-4">
              <FontAwesomeIcon icon={faTimes} />
              Une erreur est survenue :
              <p>Message : {this.state.error.message}</p>
            </div>
          )}
          <h3 className="mb-2">
            <FontAwesomeIcon className="mr-2" icon={faUser} />
            Liste des utilisateurs
          </h3>
          <Formik
            validationSchema={this.searchSchema}
            onSubmit={this.fetchUsers}
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
                  <Col md={6}>
                    <InputGroup className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="FirstnameIcon">
                          <FontAwesomeIcon icon={faUser} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder="Prénom"
                        name="firstName"
                        value={values.firstName}
                        onChange={(e) => {
                          this.setState({
                            formValues: {
                              ...this.state.formValues,
                              firstName: e.target.value,
                            },
                          });
                          handleChange(e);
                        }}
                        isInvalid={!!errors.firstName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Col>
                  <Col md={6}>
                    <InputGroup className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="LastnameIcon">
                          <FontAwesomeIcon icon={faUser} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder="Nom de famille"
                        name="lastName"
                        value={values.lastName}
                        onChange={(e) => {
                          this.setState({
                            formValues: {
                              ...this.state.formValues,
                              lastName: e.target.value,
                            },
                          });
                          handleChange(e);
                        }}
                        isInvalid={!!errors.lastName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Col>
                </Row>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="RoleIcon">
                      <FontAwesomeIcon icon={faUserTag} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    id="role"
                    as="select"
                    value={values.role}
                    onChange={(e) => {
                      this.setState({
                        formValues: {
                          ...this.state.formValues,
                          role: e.target.value,
                        },
                      });
                      handleChange(e);
                    }}
                    isInvalid={!!errors.role}
                  >
                    <option>{defaultRole}</option>
                    {this.state.roles.map((role) => (
                      <option key={role.id}>{role.name}</option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.role}
                  </Form.Control.Feedback>
                </InputGroup>
                <Button variant="primary" type="submit">
                  RECHERCHER{" "}
                  <FontAwesomeIcon className="ml-2" icon={faSearch} />
                </Button>
              </Form>
            )}
          </Formik>

          <ItemsTable<User>
            paginatedItems={paginatedItems}
            columns={columns}
            handlePageChange={this.handlePageChange}
            handleEdit={this.handleEdit}
            handleDelete={this.handleDelete}
            deleteMessage={this.deleteMessage}
            globalActions={{
              actions: [
                {
                  icon: faEnvelope,
                  handle: (selectedItems: User[]) =>
                    this.setState({
                      showEmailModal: true,
                      selectedUsers: selectedItems,
                    }),
                },
              ],
              fetchAll: this.fetchAllResults,
            }}
          />
        </div>
      </main>
    );
  }
}

export const UserListWithRouter = withRouter(UserList);
