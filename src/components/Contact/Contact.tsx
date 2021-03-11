import React from "react";
import { InputGroup, FormControl,Row,Col,Button } from "react-bootstrap";
import "./Contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faAt, faComment,faPaperPlane } from "@fortawesome/free-solid-svg-icons";

class Contact extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
   this.state = {
       firstname:"",
       lastname:"",
        email:"",
        subject:"",
        content: ""
   }
   this.handleChange = this.handleChange.bind(this);
   this.sendEmail = this.sendEmail.bind(this);
  }
  handleChange(event : any) {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }
  sendEmail(){
    fetch(process.env.REACT_APP_API_URL+'utils/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state)
    }).then(response => console.log(response.json()));

  }

  render() {
    return (
      <main className="p-5 w-100 bg">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="p-5 form w-75 mx-auto">
            <h3 className="mb-2"><FontAwesomeIcon className="mr-2" icon={faPaperPlane}/> Nous contacter</h3>
            <p className="mb-5">
                Vous pouvez nous contacter à travers ce formulaire dans le cas d'un problème, d'une question ou de toute autres demandes. Nous nous engageons à vous répondre au plus vite.
            </p>
            <Row>
                <Col md={6}>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                        <InputGroup.Text id="FirstnameIcon"><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        placeholder="Prénom"
                        name="firstname"
                        aria-describedby="FirstnameIcon"
                        value={this.state.firstname} 
                        onChange={this.handleChange}
                        />
                    </InputGroup>
                </Col>
                <Col md={6}>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                        <InputGroup.Text id="LastnameIcon"><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        placeholder="Nom de famille"
                        name="lastname"
                        aria-describedby="LastnameIcon"
                        value={this.state.lastname} 
                        onChange={this.handleChange}
                        />
                    </InputGroup>
                </Col>
            </Row>
    
            <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                        <InputGroup.Text id="MailIcon"><FontAwesomeIcon icon={faAt} /></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        placeholder="Adresse email"
                        name="email"
                        aria-describedby="MailIcon"
                        value={this.state.email} 
                        onChange={this.handleChange}
                        />
            </InputGroup>
            <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                        <InputGroup.Text id="SubjectIcon"><FontAwesomeIcon icon={faComment} /></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        placeholder="Sujet"
                        name="subject"
                        aria-describedby="SubjectIcon"
                        value={this.state.subject} 
                        onChange={this.handleChange}
                        />
            </InputGroup>


            <FormControl as="textarea" name="content" placeholder="Votre message"  value={this.state.content} onChange={this.handleChange}/>    
            <Button className="mx-auto mt-4 d-block pl-4 pr-4" onClick={this.sendEmail}>ENVOYER LE MESSAGE <FontAwesomeIcon className="ml-2" icon={faPaperPlane}/></Button>
        </div>
      </main>
    );
  }
}

export default Contact;
