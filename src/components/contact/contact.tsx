import React from 'react';
import {
  InputGroup,
  FormControl,
  Row,
  Col,
  Button,
  Form,
} from 'react-bootstrap';
import './contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faAt,
  faComment,
  faPaperPlane,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import ReactDOMServer from 'react-dom/server';
import { Formik } from 'formik';
import { FormValues } from './models';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';

class Contact extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      success: 0,
      recaptcha: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
  }
  schema = Yup.object().shape({
    firstname: Yup.string()
      .min(2, 'Trop court !')
      .required('Le prénom est requis'),
    lastname: Yup.string().min(2, 'Trop court !'),
    content: Yup.string().min(10, 'Trop court !'),
    subject: Yup.string().min(5, 'Trop court !'),
    email: Yup.string().email("L'email doit avoir un format valide"),
  });
  initialValues: FormValues = {
    firstname: '',
    lastname: '',
    content: '',
    subject: '',
    email: '',
  };
  handleChange(event: any) {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  }

  // Sends the email to ConfigUrHouse
  sendEmail(values: FormValues) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/utils/sendEmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: values.email,
        subject: 'Formulaire de contact',
        content: this.htmlMail(
          values.firstname,
          values.lastname,
          values.email,
          values.subject,
          values.content
        ),
      }),
    }).then(
      (result) => {
        this.setState({ success: 1 });
      },
      (error) => {
        this.setState({ success: -1 });
      }
    );
  }

  // Formats the email text to html
  htmlMail(
    firstname: string,
    lastname: string,
    email: string,
    subject: string,
    content: string
  ) {
    return ReactDOMServer.renderToString(
      <div>
        <h2>
          ConfigUr
          <br />
          <span style={{ color: '#1a7c7d' }}>house.</span>
        </h2>
        <p>
          Un utilisateur a envoyé un email avec le formulaire de contact de
          l'application ConfigUrHouse
        </p>
        <h4 style={{ color: '#1a7c7d' }}>Informations du contact :</h4>

        <ul>
          <li>
            Nom/Prénom : {firstname} {lastname}
          </li>
          <li>Email : {email}</li>
          <li>Sujet : {subject}</li>
        </ul>

        <h4 style={{ color: '#1a7c7d' }}>Contenu du message :</h4>
        <p>{content}</p>
      </div>
    );
  }

  render() {
    return (
      <main className='p-5 w-100 bg contact-main'>
        <div className='circle1'></div>
        <div className='circle2'></div>
        <div className='form form-contact mx-auto'>
          <h3 className='mb-2'>
            <FontAwesomeIcon className='mr-2' icon={faPaperPlane} /> Nous
            contacter
          </h3>
          <p className='mb-4'>
            Vous pouvez nous contacter à travers ce formulaire dans le cas d'un
            problème, d'une question ou de toutes autres demandes. Nous nous
            engageons à vous répondre au plus vite.
          </p>
          {(this.state.success == 1 && (
            <div className='alert alert-success mb-4'>
              <FontAwesomeIcon icon={faCheck} /> Email envoyé avec succès, nous
              vous réponderons au plus vite.
            </div>
          )) ||
            (this.state.success == -1 && (
              <div className='alert alert-danger m-4'>
                <FontAwesomeIcon icon={faTimes} /> Une erreur est survenue lors
                de l'envoi du mail, veuillez réessayer plus tard.
              </div>
            )) ||
            ''}
          <Formik
            validationSchema={this.schema}
            onSubmit={(values, { resetForm }) => {
              this.sendEmail(values);
              resetForm({
                values: {
                  firstname: '',
                  lastname: '',
                  content: '',
                  subject: '',
                  email: '',
                },
              });
            }}
            initialValues={this.initialValues}
          >
            {({ handleSubmit, handleChange, values, errors, isValid }) => (
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
                    <InputGroup.Text id='SubjectIcon'>
                      <FontAwesomeIcon icon={faComment} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    placeholder='Sujet'
                    name='subject'
                    value={values.subject}
                    onChange={(e) => {
                      this.setState({ formValues: values });
                      handleChange(e);
                    }}
                    isInvalid={!!errors.subject}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {errors.subject}
                  </Form.Control.Feedback>
                </InputGroup>

                <FormControl
                  as='textarea'
                  placeholder='Votre message'
                  name='content'
                  value={values.content}
                  onChange={(e) => {
                    this.setState({ formValues: values });
                    handleChange(e);
                  }}
                  isInvalid={!!errors.content}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.content}
                </Form.Control.Feedback>
                <div className='recaptcha-container'>
                  <ReCAPTCHA
                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY ?? ''}
                    onChange={(recaptcha) => this.setState({ recaptcha })}
                  />
                </div>
                <Button
                  variant='primary'
                  className='d-block mx-auto mt-3 p-3'
                  type='submit'
                  disabled={!isValid || !this.state.recaptcha}
                >
                  ENVOYER LE MESSAGE{' '}
                  <FontAwesomeIcon className='ml-2' icon={faPaperPlane} />
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    );
  }
}

export default Contact;
