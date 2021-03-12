import { Component } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPaperPlane, faTimes, faUserAltSlash, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { Form, Row,Col, FormControl,Button } from "react-bootstrap";
import ReactDOMServer from 'react-dom/server';

class UserAccountDelete extends React.Component<any, any> {
 
  constructor(props: any) {
    super(props);
    this.state = {
        reason : '',
        user:{
            id: 1,
            firstname: "prenom",
            lastname: "nom",
            email: "test@configurhouse.com",
            active:1,
        }
    }

    this.sendEmail = this.sendEmail.bind(this);
    }
  sendEmail(){
    fetch('http://localhost:7000/utils/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: this.state.user.email,
            subject: "Demande du suppression de compte",
            content : this.htmlMail(this.state.reason)
        })
    }).then(
        (result) => {
            this.setState({success: 1})
        },
        (error) => {
            this.setState({success: -1})
        });

  }
  htmlMail(reason :string){
    return ReactDOMServer.renderToString(
      <div>
          <h2>
              ConfigUr
              <br />
              <span style={{color: "#1a7c7d"}}>house.</span>
          </h2>
          <p>Un utilisateur a effectué une demande de suppression de son compte</p>
          <h4 style={{color: "#1a7c7d"}}>Informations du compte :</h4>

              <ul>
                  <li>Nom/Prénom : {this.state.user.firstname} {this.state.user.lastname} </li>
                  <li>Email : {this.state.user.email}</li>
                  <li>ID : {this.state.user.id}</li>
              </ul>                    


          <h4 style={{color: "#1a7c7d"}}>Raison de la demande de suppression :</h4>
          <p>{reason}</p>
      </div>
    )
}
  render() {
      
    return (
        <main className="p-5 w-100 bg-white m-0 user-accountdelete">
            <h2 className="text-green text-center"><FontAwesomeIcon icon={faUserShield} /> Suppression du compte</h2>
            <h6 className="text-center mt-2 mb-5">Vous pouvez ici demander la suppression de votre compte.</h6>
            <hr/>
            <h4 className="mt-5 text-green text-center mb-4"><FontAwesomeIcon icon={faUserAltSlash} /> Demander la suppression de mon compte :</h4>
            {
                this.state.success == 1 ? <div className="alert alert-success mb-4"><FontAwesomeIcon icon={faCheck}  /> Demande envoyée avec succès, nous la traiterons au plus vite.</div>
                : this.state.success == -1 ? <div className="alert alert-danger m-4"><FontAwesomeIcon icon={faTimes}  /> Une erreur est survenue lors de l'envoi de la demande, veuillez réessayer plus tard.</div>
                :''
            }
            <Form className="form shadow-none" onSubmit={this.sendEmail}>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <p className="mb-2 ml-3 text-center">Raison de la demande de suppression :</p>
                        <FormControl as="textarea" onChange={(e) => {this.setState({ reason: e.target.value });}}></FormControl>
                        <Button variant="primary" className="d-block mx-auto mt-3 p-3" onClick={this.sendEmail}>
                        ENVOYER LA DEMANDE <FontAwesomeIcon className="ml-2" icon={faPaperPlane}/>
                        </Button>
                    </Col>
                </Row>
              
            </Form>

            <div className="circle1"></div>
            <div className="circle2"></div>
      </main>
    );
  }
}

export default UserAccountDelete;
