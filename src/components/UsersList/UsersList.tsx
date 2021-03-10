import React from "react";
import { Button, Form, Pagination, Table } from "react-bootstrap";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PaginatedResponse } from "../../utils/pagination";
import { User, UsersState } from "./Models";

const defaultType = "Tous";

export class UsersList extends React.Component<{}, UsersState> {
  constructor(props: {}) {
    super(props);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitSearch = this.submitSearch.bind(this);

    this.state = {
      users: [],
      firstName: "",
      lastName: "",
      id: "",
      type: defaultType,
      currentPage: 0,
      totalPages: 0,
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers() {
    if (this.state.id) {
      fetch(`${process.env.REACT_APP_API_URL}user/${this.state.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(async (response) => {
        this.setState({ users: [(await response.json()) as User] });
      });
    } else {
      const queryParams = [
        `${this.state.firstName ? `firstname=${this.state.firstName}` : ""}`,
        `${this.state.lastName ? `lastname=${this.state.lastName}` : ""}`,
        `${this.state.type !== defaultType ? `type=${this.state.type}` : ""}`,
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
  }

  handleEdit() {}

  handleDelete() {}

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target: EventTarget & HTMLInputElement = event.target;
    const value: string = target.value;
    const name: string = target.name;
    switch (name) {
      case "firstname":
        this.setState({
          firstName: value,
        });
        break;
      case "lastname":
        this.setState({
          lastName: value,
        });
        break;
      case "id":
        this.setState({
          id: value,
        });
        break;
      case "type":
        this.setState({
          type: value,
        });
        break;
      default:
        throw new Error("incorrect value");
    }
  }

  handlePageChange(event: React.MouseEvent, value: number) {
    this.setState(
      {
        currentPage: value,
      },
      this.fetchUsers
    );
  }

  submitSearch(event: React.FormEvent) {
    event.preventDefault();
    this.fetchUsers();
  }

  render() {
    return (
      <main className="users">
        <Form>
          <Form.Group controlId="formSearchId">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="number"
              min={0}
              placeholder="Entrez un ID"
              name="id"
              value={this.state.id}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formSearchFirstName">
            <Form.Label>Prénom</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez un prénom"
              name="firstname"
              value={this.state.firstName}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formSearchLastName">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez un nom"
              name="lastname"
              value={this.state.lastName}
              onChange={this.handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formSearchType">
            <Form.Label>Type d'utilisateur</Form.Label>
            <Form.Control
              as="select"
              name="type"
              value={this.state.type}
              onChange={this.handleInputChange}
            >
              <option>Tous</option>
              <option>Utilisateur</option>
              <option>Administrateur</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" onClick={this.submitSearch} type="submit">
            Rechercher
          </Button>
        </Form>
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
                  <td>{user.active ? "Oui" : "Non"}</td>
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
