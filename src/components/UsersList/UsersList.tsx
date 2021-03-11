import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, Form, Pagination, Table } from "react-bootstrap";
import {
  faCheck,
  faTimes,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PaginatedResponse } from "../../utils/pagination";
import { User, UsersState, FormValues } from "./Models";

export class UsersList extends React.Component<{}, UsersState> {
  constructor(props: {}) {
    super(props);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      formValues: this.initialValues,
      users: [],
      currentPage: 0,
      totalPages: 0,
    };
  }

  defaultType = "Tous";

  schema = Yup.object().shape({
    firstName: Yup.string().min(2, "Trop court !"),
    lastName: Yup.string(),
    type: Yup.string().oneOf(
      ["Utilisateur", "Administrateur", "Tous"],
      "Le type doit être Utilisateur ou Administrateur ou Tous"
    ),
  });

  initialValues: FormValues = {
    firstName: "",
    lastName: "",
    type: this.defaultType,
  };

  componentDidMount() {
    this.fetchUsers(this.initialValues);
  }

  fetchUsers(values: FormValues) {
    const queryParams = [
      `${values.firstName ? `firstname=${values.firstName}` : ""}`,
      `${values.lastName ? `lastname=${values.lastName}` : ""}`,
      `${values.type !== this.defaultType ? `type=${values.type}` : ""}`,
      `page=${this.state.currentPage}`,
      `size=10`,
    ]
      .filter((param) => {
        if (param) return param;
      })
      .join("&");
    fetch(`${process.env.REACT_APP_API_URL}user?${queryParams}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (response) => {
        const data = (await response.json()) as PaginatedResponse<User>;
        this.setState({
          users: data.items,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
        });
      })
      .catch((_response) => {
        this.setState({ users: [] });
      });
  }

  handleEdit() {}

  handleDelete() {}

  handlePageChange(event: React.MouseEvent, value: number) {
    this.setState(
      {
        currentPage: value,
      },
      () => {
        this.fetchUsers(this.state.formValues);
      }
    );
  }

  render() {
    return (
      <main className="users">
        <Formik
          validationSchema={this.schema}
          onSubmit={this.fetchUsers}
          initialValues={this.initialValues}
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
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  id="firstName"
                  type="text"
                  placeholder="Entrez un prénom"
                  value={values.firstName}
                  onChange={(e) => {
                    this.setState({ formValues: values });
                    handleChange(e);
                  }}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  id="lastName"
                  type="text"
                  placeholder="Entrez un nom"
                  value={values.lastName}
                  onChange={(e) => {
                    this.setState({ formValues: values });
                    handleChange(e);
                  }}
                  isInvalid={!!errors.lastName}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Type d'utilisateur</Form.Label>
                <Form.Control
                  id="type"
                  as="select"
                  name="type"
                  value={values.type}
                  onChange={(e) => {
                    this.setState({ formValues: values });
                    handleChange(e);
                  }}
                  isInvalid={!!errors.type}
                >
                  <option>Tous</option>
                  <option>Utilisateur</option>
                  <option>Administrateur</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.type}
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit">
                Rechercher
              </Button>
            </Form>
          )}
        </Formik>
        <Pagination>
          <Pagination.First
            disabled={this.state.currentPage === 0}
            onClick={(event) => this.handlePageChange(event, 0)}
          />
          <Pagination.Prev
            disabled={this.state.currentPage === 0}
            onClick={(event) =>
              this.handlePageChange(event, this.state.currentPage - 1)
            }
          />
          <Pagination.Item active>{this.state.currentPage + 1}</Pagination.Item>
          <Pagination.Next
            disabled={this.state.currentPage === this.state.totalPages - 1}
            onClick={(event) =>
              this.handlePageChange(event, this.state.currentPage + 1)
            }
          />
          <Pagination.Last
            disabled={this.state.currentPage === this.state.totalPages - 1}
            onClick={(event) =>
              this.handlePageChange(event, this.state.totalPages - 1)
            }
          />
        </Pagination>
        <Table bordered hover className="mt-5 text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Vérifié</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users &&
              this.state.users.map((user: User, index) => (
                <tr key={index}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={user.active ? faCheck : faTimes}
                      color={user.active ? "green" : "red"}
                    />
                  </td>
                  <td>
                    <FontAwesomeIcon icon={faPen} onClick={this.handleEdit} />
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={this.handleDelete}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </main>
    );
  }
}
