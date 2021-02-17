import React from 'react';
import {Col, Row, Form, FormGroup, Button} from 'react-bootstrap'
import home_3D from '../../assets/images/home_3D.png';
import './Configurator.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleRight} from '@fortawesome/free-solid-svg-icons'
function Configurator() {
  return (
    <main className="configurator p-5">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <h3>Configurateur</h3>
        <Row>
            <Col md={8} className="col">
                <div className="content">
                    <h5>Visualisation</h5>
                    <img src={home_3D} alt="Home config" className="w-100"/>
                </div>
            </Col>
            <Col md={4} className="col">
                <div className="content options">
                    <h5 className="text-light">Options</h5>
                    <Form>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Control as="select">
                            <option>Parquet Flottant</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Control as="select">
                            <option>Bardage bois</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Control as="select">
                            <option>Ossature métale</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Control as="select">
                            <option>Meublé</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Control as="select">
                            <option>Papier peint noir</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Control as="select">
                            <option>Pas de terrasse</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Control as="select">
                            <option>Isolation passive</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </div>
            </Col>
        </Row>
        <Row>
            <Col md={4} className="col devis">
                <div className="content text-center">
                <h5>Aperçu du devis</h5>
                    <Row className="mb-0">
                        <Col>
                            <h6>Bardage</h6>
                            <p>10 343,56€</p>
                        </Col>
                        <Col>
                            <h6>Charpente</h6>
                            <p>10 343,56€</p>
                        </Col>
                        <Col>
                            <h6>Menuiserie</h6>
                            <p>10 343,56€</p>
                        </Col>
                    </Row>
                    <div className="total">34 343,23€</div>
                </div>
            </Col>
            <Col md={4} className="col conso">
                <div className="content">
                <Row>
                    <Col md={7}>
                    <h5>Aperçu de la consommation</h5>
                    <p>
                        Comparer la consommation de ce logement par rapport à des logements de références.
                    </p>
                    </Col>
                    <Col md={5}>
                    
                    </Col>
                </Row>
                </div>
            </Col>
            <Col md={4} className="col next">
                <div className="content">
                    <Button>SUIVANT <FontAwesomeIcon icon={faArrowCircleRight} size="lg" /></Button>
               </div>   
            </Col>
        </Row>
    </main>
  );
}

export default Configurator;
