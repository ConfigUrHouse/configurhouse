import React from "react";
import ModelChoice from './model-choice/model-choice'
import ModelConfiguration from './model-configuration/model-configuration'
import { Col, Row, Button } from "react-bootstrap";
import "./configurator.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";

class Configurator extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { model: null, modelSelected: null, step:0 };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.changeModelChoice = this.changeModelChoice.bind(this);
  }
  changeModelChoice(model: any) {
    this.setState({ modelSelected: model });
  }
  next() {
    if(this.state.step == 0){
        this.setState({ model: this.state.modelSelected });
        console.log(this.state.model)
    }else if(this.state.step == 1){

    }else if(this.state.step == 2){

    }
    this.setState({step: this.state.step+1});
  }
  previous(){
    this.setState({step: this.state.step-1});
  }

  render() {
      const stepName = ["Choix du modèle", "Configurateur", "Devis détaillé", "Consommation", "Validation"]
    return (
      <main className="configurator p-5 w-100">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="timeline">
            <div className={`step ${this.state.step == 0 ? "active" : ""}`}><span>1</span>Choix</div>
            <div className="line"><hr /></div>
            <div className={`step ${this.state.step == 1 ? "active" : ""}`}><span>2</span>Configuration</div>
            <div className="line"><hr /></div>
            <div className={`step ${this.state.step == 2 ? "active" : ""}`}><span>3</span>Devis détaillé</div>
            <div className="line"><hr /></div>
            <div className={`step ${this.state.step == 3 ? "active" : ""}`}><span>4</span>Consommation</div>
            <div className="line"><hr /></div>
            <div className={`step ${this.state.step == 4 ? "active" : ""}`}><span>5</span>Validation</div>
        </div>
        <h5 className="mb-1">{stepName[this.state.step]}</h5>
        {this.state.step == 0 && (
            <ModelChoice model={this.state.model} onChange={this.changeModelChoice}/>
        )}
        {this.state.step == 1 && (
            <ModelConfiguration model={this.state.model}/>
        )}
        <Row className="justify-content-end">
            <Col md={2} className="col next">
                <div className="content">
                    <Button className="mt-0" onClick={this.previous}>PRECEDENT{" "}<FontAwesomeIcon icon={faArrowCircleLeft} size="lg" /></Button>
                </div>
            </Col>
            <Col md={2} className="col next">
                <div className="content">
                    <Button className="mt-0" onClick={this.next}>SUIVANT{" "}<FontAwesomeIcon icon={faArrowCircleRight} size="lg" /></Button>
                </div>
            </Col>
        </Row>
      </main>
    );
  }
}

export default Configurator;
