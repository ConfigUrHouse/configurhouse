import { connect } from "react-redux";
import "./Login.css";
import { InputGroup, FormControl,Button } from "react-bootstrap";
import * as Yup from "yup";
import { apiRequest } from "../../api/utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAt,
  faCheck,
  faTimes,
  faSignInAlt,
  faKey,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { Form, } from "react-bootstrap";
import React from "react";
import { Redirect } from "react-router-dom";
import { Formik } from "formik";
import { FormValues } from "./FormValue";


class Login extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      success: 0,
      email: null,
      password: null,
    };
  }
  
  schema = Yup.object().shape({
    email: Yup.string().email("L'email doit avoir un format valide"),
    password: Yup.string().required("Le mot de passe est requis"),
  });
  initialValues: FormValues = {
    email: "",
    password: "",
  };
  login(values : FormValues){
  

    apiRequest(
      'user/login',
      "POST",
      ["email="+values.email,"password="+values.password]
    )
      .then((response : any) => {
        console.log(response)
      })
      .catch((error:any) => console.log(error));

    fetch("http://localhost:7000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email:values.email,
        password: values.password
    }),
    })   .then(response => response.json())
    .then(datas => {
      if(datas.success){
          this.setState({success:1});
          window.localStorage.setItem("authenticated", "true");
          window.localStorage.setItem("token", datas.token);
   
      
      }else{
        this.setState({success:-1});
        window.localStorage.setItem("authenticated", "false");

      }
    })


    }
    handleChange(event: any) {
      let nam = event.target.name;
      let val = event.target.value;
      this.setState({ [nam]: val });
    }
 render() {
  return (  <>
  <main className="p-5 w-100">
  <div className="row justify-content-center mt-5">
  <div className="col-md-5 login mt-5">
  <h1 className="text-center text-green"><FontAwesomeIcon icon={faKey} /></h1>
  <h2 className="text-center text-green">Connexion</h2>
  <h6 className="text-center mb-5 text-green">Veuillez vous connecter afin d'accéder à votre espace personnel</h6>

  {this.state.success == 1 ? (
            <div className="alert alert-success mb-4">
              <FontAwesomeIcon icon={faCheck} /> Connexion réussie, vous allez être redirigé...
            </div>
          ) : this.state.success == -1 ? (
            <div className="alert alert-danger m-4">
              <FontAwesomeIcon icon={faTimes} /> L'identifiant ou le mot de passe est incorrect.
            </div>
          ) : (
            ""
          )}
  <Formik
            validationSchema={this.schema}
            onSubmit={(values, { resetForm }) => {
              this.login(values);
              resetForm({
                values: {     
                  email: "",
                  password: "",
                },
              });
            }}
            initialValues={this.initialValues}
          >
            {({ handleSubmit, handleChange, values, errors }) => (

  <Form noValidate className="form shadow-none" onSubmit={handleSubmit}>
    

                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="MailIcon">
                      <FontAwesomeIcon icon={faAt} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                        placeholder="Adresse email"
                        name="email"
                        value={values.email}
                        onChange={(e) => {
                          this.setState({ formValues: values });
                          handleChange(e);
                        }}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                  
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="SubjectIcon">
                      <FontAwesomeIcon icon={faLock} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                        placeholder="Mot de passe"
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={(e) => {
                          this.setState({ formValues: values });
                          handleChange(e);
                        }}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                  
                  
                </InputGroup>

              
                <Button
                  variant="primary"
                  className="d-block mx-auto mt-3 p-3"
                  type="submit"
                >
                  SE CONNECTER
                  <FontAwesomeIcon className="ml-2" icon={faSignInAlt} />
                </Button>
              </Form>
                 )}
                 </Formik>
              </div>
              </div>

  </main>

  </>
)};
  }

export default Login;