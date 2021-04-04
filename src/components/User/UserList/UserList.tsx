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

const defaultRole = "Tous";

const initialValues: FormValues = {
  firstName: "",
  lastName: "",
  role: defaultRole,
};

const initialEmailValues = {
  subject: "",
  content: ""
}

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
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteModalClose = this.handleDeleteModalClose.bind(this);
    this.handleEmailModalClose = this.handleEmailModalClose.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);

    this.state = {
      formValues: initialValues,
      paginatedItems: emptyPaginatedData<User>(),
      roles: [],
      error: undefined,
      showDeleteModal: false,
      showEmailModal: false,
      userToDelete: undefined,
      selectedUsers: []
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
    content: Yup.string().required("Veuillez saisir un message")
  })

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

  private handleEdit(id: number): void {
    let path = `user/${id}/edit`;
    this.props.history.push(path);
  }

  private confirmDelete(id: number): void {
    this.setState({ showDeleteModal: true, userToDelete: this.state.paginatedItems.items.find(user => user.id === id) });
  }

  private handleDeleteModalClose(): void {
    this.setState({ showDeleteModal: false });
  }

  private async handleDelete(id: number): Promise<void> {
    apiRequest(`user/${id}`, "DELETE", [])
      .then((response) => {
        if (response.status === "error") {
          this.setState({ error: response as ApiResponseError });
        } else {
          this.fetchUsers();
        }
        this.handleDeleteModalClose()
      })
      .catch((error) => console.log(error));
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

  private async sendEmails(emailList: string[], subject: string, content: string) {
    apiRequest(`utils/sendEmails`, "POST", [], JSON.stringify({
      emails: emailList,
      subject: subject,
      content: `<p>${content}<p>`
    }))
      .then((response) => {
        if (response.status === "error") {
          this.setState({ error: response as ApiResponseError });
        }
        this.handleEmailModalClose()
      })
      .catch((error) => console.log(error));
  }

  render() {
    const { paginatedItems } = this.state;
    return (
      <main className="p-5 w-100 bg">
        <Modal show={this.state.showEmailModal} onHide={this.handleEmailModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Envoyer un email</Modal.Title>
          </Modal.Header>
          <Formik
            validationSchema={this.emailSchema}
            onSubmit={(values) => this.sendEmails(this.state.selectedUsers.map(user => user.email), values.subject, values.content)}
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
                  <p className="text-center">Voulez-vous envoyer un email à {this.state.selectedUsers.length} utilisateur(s) ?</p>
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
                  <FormControl
                    as="textarea"
                    placeholder="Votre message"
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    isInvalid={!!errors.content}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.content}
                  </Form.Control.Feedback>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleEmailModalClose}>
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
        {this.state.userToDelete &&
          <Modal show={this.state.showDeleteModal && this.state.userToDelete} onHide={this.handleDeleteModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmer la suppression</Modal.Title>
            </Modal.Header>
            <Modal.Body>Voulez-vous supprimer l'utilisateur {this.state.userToDelete?.firstname} {this.state.userToDelete?.lastname} ({this.state.userToDelete?.email}) ?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleDeleteModalClose}>
                Annuler
              </Button>
              <Button variant="danger" onClick={() => this.handleDelete(this.state.userToDelete?.id || -1)}>
                SUPPRIMER
              </Button>
            </Modal.Footer>
          </Modal>}
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
            handleDelete={this.confirmDelete}
            globalActions={[{ icon: faEnvelope, handle: ((selectedItems: User[]) => this.setState({ showEmailModal: true, selectedUsers: selectedItems })) }]}
          />
        </div>
      </main>
    );
  }
}

export const UserListWithRouter = withRouter(UserList);
