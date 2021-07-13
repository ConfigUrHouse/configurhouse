import {
  faAt,
  faSave,
  faTimes,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldArray, Formik } from 'formik';
import React from 'react';
import {
  Button,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
} from 'react-bootstrap';
import { withRouter } from 'react-router';
import * as Yup from 'yup';
import { ApiResponseError } from '../../../api/models';
import { apiRequest } from '../../../api/utils';
import { Role, User, UserRole } from '../../../models';
import { FormValues, UserEditProps, UserEditState } from './models';
import './user-edit.css';

export class UserEdit extends React.Component<UserEditProps, UserEditState> {
  constructor(props: UserEditProps) {
    super(props);

    this.submitForm = this.submitForm.bind(this);

    const id = parseInt(this.props.match.params.id);
    this.state = {
      id,
      availableRoles: [],
      error: undefined,
    };
  }

  schema = Yup.object().shape({
    firstname: Yup.string().min(2, 'Trop court !'),
    lastname: Yup.string().min(2, 'Trop court !'),
    roles: Yup.array()
      .of(Yup.number())
      .min(1, 'Vous devez cocher au moins un rôle'),
  });

  initialValues: FormValues = {
    firstname: '',
    lastname: '',
    email: '',
    verified: false,
    roles: [],
  };

  componentDidMount() {
    this.fetchUser();
    this.fetchUserRoles();
    this.fetchAvailableRoles();
  }

  // Loads the user
  async fetchUser(): Promise<void> {
    apiRequest(`user/${this.state.id}`, 'GET', [])
      .then((response) => {
        if (response.status === 'error') {
          this.setState({ error: response as ApiResponseError });
        } else {
          const user = response as User;
          this.initialValues = {
            ...this.initialValues,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            verified: !!user.active,
          };
        }
      })
      .catch((error) => console.log(error));
  }

  // Loads the user's roles
  async fetchUserRoles(): Promise<void> {
    apiRequest(`userRole/${this.state.id}`, 'GET', [])
      .then((response) => {
        if (response.status === 'error') {
          this.setState({ error: response as ApiResponseError });
        } else {
          const userRoles = response as UserRole[];
          this.initialValues.roles = userRoles.map(
            (userRole) => userRole.id_Role
          );
        }
      })
      .catch((error) => console.log(error));
  }

  // Loads the list of roles
  async fetchAvailableRoles(): Promise<void> {
    apiRequest('role', 'GET', [])
      .then((response) => {
        if (response.status === 'error') {
          this.setState({ error: response as ApiResponseError });
        } else {
          const roles = response.items as Role[];
          this.setState({ availableRoles: roles });
        }
      })
      .catch((error) => console.log(error));
  }

  // Updates the user
  async submitForm(values: FormValues): Promise<void> {
    apiRequest(`user/${this.state.id}/update-roles`, 'PUT', '', {
      roles: values.roles.filter((role) => role),
    })
      .then((response) => {
        if (response.status === 'error') {
          this.setState({ error: response as ApiResponseError });
        } else {
          this.props.history.push('/users');
        }
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <main className='p-5 w-100 bg'>
        <div className='circle1'></div>
        <div className='circle2'></div>
        <div className='p-5 form w-75 mx-auto'>
          {this.state.error && (
            <div className='alert alert-danger m-4'>
              <FontAwesomeIcon icon={faTimes} />
              Une erreur est survenue :
              <p>Message : {this.state.error.message}</p>
            </div>
          )}
          <h3 className='mb-2'>
            <FontAwesomeIcon className='mr-2' icon={faUser} />
            Editer un utilisateur
          </h3>
          <Formik
            validationSchema={this.schema}
            onSubmit={(values) => {
              this.submitForm(values);
            }}
            initialValues={this.initialValues}
            enableReinitialize
          >
            {({
              handleSubmit,
              handleChange,
              values,
              errors,
              isValid,
              dirty,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <InputGroup className='mb-3'>
                      <InputGroup.Prepend>
                        <InputGroup.Text id='FirstnameIcon'>
                          <FontAwesomeIcon icon={faUser} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder='Prénom'
                        name='firstname'
                        value={values.firstname}
                        onChange={handleChange}
                        isInvalid={!!errors.firstname}
                        disabled
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.firstname}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Col>
                  <Col md={6}>
                    <InputGroup className='mb-3'>
                      <InputGroup.Prepend>
                        <InputGroup.Text id='LastnameIcon'>
                          <FontAwesomeIcon icon={faUser} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder='Nom de famille'
                        name='lastname'
                        value={values.lastname}
                        onChange={handleChange}
                        isInvalid={!!errors.lastname}
                        disabled
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.lastname}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Col>
                </Row>

                <InputGroup className='mb-3'>
                  <InputGroup.Prepend>
                    <InputGroup.Text id='MailIcon'>
                      <FontAwesomeIcon icon={faAt} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    placeholder='Adresse email'
                    name='email'
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    disabled
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.email}
                  </Form.Control.Feedback>
                </InputGroup>
                <FieldArray
                  name='roles'
                  render={(arrayHelpers) => (
                    <div>
                      {this.state.availableRoles.map((role, index) => (
                        <div>
                          <Form.Check>
                            <Form.Check.Input
                              key={role.id}
                              name='roles'
                              value={role.id}
                              checked={values.roles.includes(role.id)}
                              onChange={(e: any) => {
                                if (e.target.checked)
                                  arrayHelpers.push(role.id);
                                else {
                                  const idx = values.roles.indexOf(role.id);
                                  arrayHelpers.remove(idx);
                                }
                              }}
                              isInvalid={!!errors.roles}
                            />
                            <Form.Check.Label>{role.name}</Form.Check.Label>
                            {index === this.state.availableRoles.length - 1 && (
                              <Form.Control.Feedback type='invalid'>
                                {errors.roles}
                              </Form.Control.Feedback>
                            )}
                          </Form.Check>
                        </div>
                      ))}
                    </div>
                  )}
                />
                <Button
                  variant='primary'
                  className='d-block mx-auto mt-3 p-3'
                  type='submit'
                  disabled={!isValid}
                >
                  SAUVEGARDER <FontAwesomeIcon className='ml-2' icon={faSave} />
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    );
  }
}

export const UserEditWithRouter = withRouter(UserEdit);
