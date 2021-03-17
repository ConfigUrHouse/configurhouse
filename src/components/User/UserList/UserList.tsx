import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { emptyPaginatedData, PaginatedResponse } from '../../../utils/pagination';
import { UsersListState, FormValues, UserListProps } from './Models';
import { apiRequest } from '../../../api/utils';
import { ItemsTableColumn } from '../../Templates/ItemsTable/Models';
import { ItemsTable } from '../../Templates/ItemsTable/ItemsTable';
import { Role, User } from '../Models';
import { withRouter } from 'react-router';

const defaultRole = 'Tous';

const initialValues: FormValues = {
  firstName: '',
  lastName: '',
  role: defaultRole,
};

const columns: ItemsTableColumn<User>[] = [
  {
    name: 'id',
    displayName: 'ID',
  },
  {
    name: 'lastname',
    displayName: 'Nom',
  },
  {
    name: 'firstname',
    displayName: 'Prénom',
  },
  {
    name: 'email',
    displayName: 'Email',
  },
  {
    name: 'active',
    displayName: 'Vérifié',
    component(item) {
      return (
        <FontAwesomeIcon
          icon={item.active ? faCheck : faTimes}
          color={item.active ? 'green' : 'red'}
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
    this.handlePageChange = this.handlePageChange.bind(this);

    this.state = {
      formValues: initialValues,
      paginatedItems: emptyPaginatedData<User>(),
      roles: []
    };
  }

  schema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Trop court !'),
    lastName: Yup.string(),
    role: Yup.lazy(() => Yup.string().oneOf([...this.state.roles.map(role => role.name), defaultRole]))
  });

  componentDidMount() {
    this.fetchRoles();
    this.fetchUsers();
  }

  async fetchRoles() {
    try {
      const roles: Role[] = await apiRequest(
        'role',
        'GET',
        []
      );
      this.setState({ roles });
    } catch (error) {
      this.setState({ roles: [] });
    }
  }

  async fetchUsers() {
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

    try {
      const paginatedItems: PaginatedResponse<User> = await apiRequest(
        'user',
        'GET',
        queryParams
      );

      this.setState({ paginatedItems });
    } catch (error) {
      this.setState({ paginatedItems: emptyPaginatedData<User>() });
    }
  }

  handleEdit(id: number) {
    let path = `user/${id}/edit`;
    this.props.history.push(path);
  }

  async handleDelete(id: number) {
    try {
      await apiRequest(`user/${id}`, 'DELETE', [])
      this.fetchUsers();
    } catch (error) {
      console.log(error)
    }
  }

  handlePageChange(value: number) {
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

  render() {
    const { paginatedItems } = this.state;

    return (
      <main className="users w-100">
        <Formik
          validationSchema={this.schema}
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
              <Form.Group>
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  id="firstName"
                  type="text"
                  placeholder="Entrez un prénom"
                  value={values.firstName}
                  onChange={(e) => {
                    this.setState({ formValues: { ...this.state.formValues, firstName: e.target.value } });
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
                    this.setState({ formValues: { ...this.state.formValues, lastName: e.target.value } });
                    handleChange(e);
                  }}
                  isInvalid={!!errors.lastName}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Rôle</Form.Label>
                <Form.Control
                  id="role"
                  as="select"
                  value={values.role}
                  onChange={(e) => {
                    this.setState({ formValues: { ...this.state.formValues, role: e.target.value } });
                    handleChange(e);
                  }}
                  isInvalid={!!errors.role}
                >
                  <option>{defaultRole}</option>
                  {this.state.roles.map(role => <option key={role.id}>{role.name}</option>)}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.role}
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit">
                Rechercher
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
        ></ItemsTable>
      </main>
    );
  }
}

export const UserListWithRouter = withRouter(UserList)