import React from "react";
import { ApiResponseError } from "../../api/models";
import { apiRequest } from "../../api/utils";
import {
  faDownload,
  faEuroSign,
  faHome,
  faLightbulb,
  faMousePointer,
  faSearchPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col,Row, Table } from "react-bootstrap";
import "./configuration.css";

class Configuration extends React.Component<any, any> {
 
  constructor(props: any) {
    super(props);

    this.state = {
      configuration: {},
      options: [],
      houseModel: {},
      id:parseInt(props.match.params.id ?? 0)
    };
  }

  componentDidMount() {

    this.fetchConfiguration();
  }

  async fetchConfiguration(): Promise<void> {
    try {
      const response: any = await apiRequest(
        `configuration/`+this.state.id,
        "GET",
        []
      ).then(response => {
        this.setState({ configuration: response });
        this.fetchConfigurationOptions();
        this.fetchHouseModel();
      });
    } catch (error: any) {
      console.error(error);
      this.setState({ error: error as ApiResponseError });
    }
  }

  async fetchHouseModel(): Promise<void> {
    try {
      const response: any = await apiRequest(
        `houseModel/`+this.state.configuration.id_HouseModel,
        "GET",
        []
      ).then((model : any) => {
        console.log(model)
        const modelDetails: any = apiRequest(
          `modelType/`+model.id_ModelType,
          "GET",
          []
        ).then((modelDetails : any) => {
          console.log(modelDetails);
          this.setState({houseModel : {
            id: model.id,
            name: model.name,
            modelName: modelDetails.name,
            modelDescription: modelDetails.description,
            modelId: modelDetails.id,
          }})
        });
      });
      this.setState({ model: response });
    } catch (error: any) {
      console.error(error);
      this.setState({ error: error as ApiResponseError });
    }
  }
  async fetchConfigurationOptions(): Promise<void> {
    try {
      const response: any = await apiRequest(
        `configurationValue/`+this.state.id,
        "GET",
        []
      ).then(response => {
        response.forEach((element : any) => {


          try {
            const option: any = apiRequest(
              `value/`+element.id_Value,
              "GET",
              []
            ).then(option => {

              this.setState({ 
                options: this.state.options.concat([option])
              })
              
            });
  
           
          } catch (error: any) {
            console.error(error);
            this.setState({ error: error as ApiResponseError });
          }
        });
      });
      
     
    } catch (error: any) {
      console.error(error);
      this.setState({ error: error as ApiResponseError });
    }
  }
  render() {
    const { id } = this.state;
    return (
      <main className="p-5 w-100 bg configuration-infos">
          <h2 className="text-green mb-2"><FontAwesomeIcon icon={faSearchPlus} /> Détails de votre configuration : <strong>{this.state.configuration.name}</strong></h2>
          <Row>
            <Col md={6} className="p-4">
              <div className="rect">
                <h3 className="text-green text-center"><FontAwesomeIcon icon={faEuroSign} /> Vos options</h3>
                <Table  bordered hover className="text-center mt-4" >
                  <thead>
                    <tr>
                      <td>Nom de l'option</td>
                      <td>Prix de l'option</td>

                    </tr>
                  </thead>
                  <tbody>
                    {
                    this.state.options.map((option : any, i : number) => (
                      <tr key={i}>
                        <td>{option.name}</td>
                        <td>{option.price} €</td>
                      </tr>
                    ))
                    }
                    <tr className="bg-lightgreen font-weight-bold">
                      <td>Coût total des options</td>
                      <td>{this.state.options.reduce((a : any, b: any) => parseInt(a) + (parseInt(b['price']) || 0), 0)} €</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col md={6} className="p-4">
              <div className="rect">
                <h3 className="text-green text-center"><FontAwesomeIcon icon={faLightbulb} /> Bilan energétique</h3>
              </div>
            </Col>
            <Col md={6} className="p-4">
              <div className="rect">
                <h3 className="text-green text-center"><FontAwesomeIcon icon={faHome} /> Modèle choisi</h3>
                <Table  bordered hover className="text-center mt-4" >
                  <thead>
                    <tr>
                      <td>Nom</td>
                      <td>Catégorie du modèle</td>
                      <td>Description du modèle</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{this.state.houseModel.name}</td>
                      <td>{this.state.houseModel.modelName}</td>
                      <td>{this.state.houseModel.modelDescription}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col md={6} className="p-4">
              <div className="rect">
                <h3 className="text-green text-center"><FontAwesomeIcon icon={faMousePointer} /> Actions</h3>
                <div className="d-flex justify-content-center mt-4">
                  <Button variant="primary" href="/" className="p-3">
                    <FontAwesomeIcon className="mr-2" icon={faDownload} />
                    Télécharger le devis
                  </Button>
                </div>
                <div className="d-flex justify-content-center mt-4">
                  <Button variant="primary" href="/" className="p-3">
                    <FontAwesomeIcon className="mr-2" icon={faDownload} />
                    Télécharger la consommation détaillée
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        <div className="circle1"></div>
        <div className="circle2"></div>
      </main>
    );
  }
}

export default Configuration;
