import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Form, Pagination, Table } from 'react-bootstrap';
import {
  faCheck,
  faTimes,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { emptyPaginatedData, PaginatedResponse } from '../../utils/pagination';
import { User, UsersState, FormValues } from './Models';
import { apiRequest } from '../../api/utils';
import { ItemsTableColumn } from '../Templates/ItemsTable/Models';
import { ItemsTable } from '../Templates/ItemsTable/ItemsTable';

const initialValues: FormValues = {
  firstName: '',
  lastName: '',
  role: 'Tous',
};

const schema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Trop court !'),
  lastName: Yup.string(),
  role: Yup.string().oneOf(
    ['Utilisateur', 'Administrateur', 'Tous'],
    'Le rôle doit être Utilisateur ou Administrateur ou Tous'
  ),
});

const columns: ItemsTableColumn[] = [
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

export class UsersList extends React.Component<{}, UsersState> {
  constructor(props: {}) {
    super(props);
    this.fetchUsers = this.fetchUsers.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      formValues: initialValues,
      paginatedItems: emptyPaginatedData<User>(),
    };
  }

  componentDidMount() {
    this.fetchUsers();
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
    if (formValues.firstName) {
      queryParams.push(`lastname=${formValues.lastName}`);
    }
    if (formValues.firstName) {
      queryParams.push(`type=${formValues.role}`);
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
    console.log('Edit');
  }

  handleDelete(id: number) {
    console.log('Delete');
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
          validationSchema={schema}
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
                <Form.Label>Rôle</Form.Label>
                <Form.Control
                  id="type"
                  as="select"
                  value={values.role}
                  onChange={(e) => {
                    this.setState({ formValues: values });
                    handleChange(e);
                  }}
                  isInvalid={!!errors.role}
                >
                  <option>Tous</option>
                  <option>Utilisateur</option>
                  <option>Administrateur</option>
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
