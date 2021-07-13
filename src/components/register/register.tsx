import './register.css';
import { InputGroup, FormControl, Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { apiRequest } from '../../api/utils';
import { logIn } from '../../actions/current';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAt,
  faCheck,
  faTimes,
  faSignInAlt,
  faKey,
  faLock,
  faUser,
  faUserPlus,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Formik } from 'formik';
import { FormValues } from './form-value';
import { ApiResponseError } from '../../api/models';
import { withRouter } from 'react-router-dom';
interface IProps {
  logInConnect: () => void;
}
class Register extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      success: 0,
      email: null,
      password: null,
      firstname: null,
      lastname: null,
      confirmpassword: null,
      recaptcha: null,
    };
    this.register = this.register.bind(this);
  }

  schema = Yup.object().shape({
    email: Yup.string().email("L'email doit avoir un format valide"),
    password: Yup.string().required('Le mot de passe est requis'),
    firstname: Yup.string().required('Le prénom est requis'),
    lastname: Yup.string().required('Le nom de famille est requis'),
    confirmpassword: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Les mots de passes doivent correspondres'
    ),
  });
  initialValues: FormValues = {
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    confirmpassword: '',
    phone: '',
  };

  // Tries to register the user
  // If success & there is a state waiting in navigation then moves to the desired page, otherwise moves to the login page
  // Shows an error if the registration failed
  register(values: FormValues) {
    const { location, history } = this.props;
    console.log(values);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        firstname: values.firstname,
        lastname: values.lastname,
      }),
    })
      .then((response) => response.json())
      .then((datas) => {
        console.log(datas);
        if (datas.success) {
          this.setState({ success: 1 });
          if (location.state?.from) {
            history.push(location.state.from, location.state.state);
          } else {
            history.push('/login');
          }
        } else {
          this.setState({ success: -1 });
        }
      });
  }
  handleChange(event: any) {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  }
  render() {
    let alertDiv;
    if (this.state.success == 1) {
      alertDiv = (
        <div className='alert alert-success mb-4'>
          <FontAwesomeIcon icon={faCheck} /> Inscription réussie, vous allez
          être redirigé...
        </div>
      );
    } else if (this.state.success == -1) {
      alertDiv = (
        <div className='alert alert-danger m-4'>
          <FontAwesomeIcon icon={faTimes} /> Une erreur est survenue, veuillez
          réessayer plus tard
        </div>
      );
    }

    return (
      <>
        <main className='p-5 w-100'>
          <div className='row justify-content-center mt-5'>
            <div className='col-md-5 login mt-5'>
              <h1 className='text-center text-green'>
                <FontAwesomeIcon icon={faUserPlus} />
              </h1>
              <h2 className='text-center text-green'>Inscription</h2>
              <h6 className='text-center mb-5 text-green'>
                Inscrivez vous pour sauvegarder vos configurations
              </h6>
              {alertDiv}
              <Formik
                validationSchema={this.schema}
                onSubmit={(values, { resetForm }) => {
                  this.register(values);
                  resetForm({
                    values: {
                      firstname: '',
                      lastname: '',
                      email: '',
                      password: '',
                      confirmpassword: '',
                      phone: '',
                    },
                  });
                }}
                initialValues={this.initialValues}
              >
                {({ handleSubmit, handleChange, values, errors, isValid }) => (
                  <Form
                    noValidate
                    className='form shadow-none'
                    onSubmit={handleSubmit}
                  >
                    <InputGroup className='mb-3'>
                      <InputGroup.Prepend>
                        <InputGroup.Text id='EMailIcon'>
                          <FontAwesomeIcon icon={faAt} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder='Adresse email'
                        name='email'
                        value={values.email}
                        onChange={(e) => {
                          this.setState({ formValues: values });
                          handleChange(e);
                        }}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.email}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <InputGroup className='mb-3'>
                      <InputGroup.Prepend>
                        <InputGroup.Text id='PasswordIcon'>
                          <FontAwesomeIcon icon={faLock} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder='Mot de passe'
                        name='password'
                        type='password'
                        value={values.password}
                        onChange={(e) => {
                          this.setState({ formValues: values });
                          handleChange(e);
                        }}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <InputGroup className='mb-3'>
                      <InputGroup.Prepend>
                        <InputGroup.Text id='ConfirmPasswordIcon'>
                          <FontAwesomeIcon icon={faLock} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder='Confirmer votre mot de passe'
                        name='confirmpassword'
                        type='password'
                        value={values.confirmpassword}
                        onChange={(e) => {
                          this.setState({ formValues: values });
                          handleChange(e);
                        }}
                        isInvalid={!!errors.confirmpassword}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.confirmpassword}
                      </Form.Control.Feedback>
                    </InputGroup>
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
                        onChange={(e) => {
                          this.setState({ formValues: values });
                          handleChange(e);
                        }}
                        isInvalid={!!errors.firstname}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.firstname}
                      </Form.Control.Feedback>
                    </InputGroup>
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
                        onChange={(e) => {
                          this.setState({ formValues: values });
                          handleChange(e);
                        }}
                        isInvalid={!!errors.lastname}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.lastname}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <InputGroup className='mb-3'>
                      <InputGroup.Prepend>
                        <InputGroup.Text id='PhoneIcon'>
                          <FontAwesomeIcon icon={faPhone} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        placeholder='Téléphone'
                        name='phone'
                        value={values.phone}
                        onChange={(e) => {
                          this.setState({ formValues: values });
                          handleChange(e);
                        }}
                        isInvalid={!!errors.phone}
                      />
                      <Form.Control.Feedback type='invalid'>
                        {errors.phone}
                      </Form.Control.Feedback>
                    </InputGroup>
                    <ReCAPTCHA
                      sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY ?? ''}
                      onChange={(recaptcha) => this.setState({ recaptcha })}
                    />
                    <Button
                      variant='primary'
                      className='d-block mx-auto mt-3 p-3'
                      type='submit'
                      disabled={!this.state.recaptcha || !isValid}
                    >
                      S'INSCRIRE
                      <FontAwesomeIcon className='ml-2' icon={faUserPlus} />
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default withRouter(Register);
