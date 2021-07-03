import React from "react";
import { apiRequest } from "../../../api/utils";
import {
  Table,
  Button
} from "react-bootstrap";

class HouseModelDetails extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.fetchAsset = this.fetchAsset.bind(this);
    this.fetchMesh = this.fetchMesh.bind(this);
    this.handleRetour = this.handleRetour.bind(this);
    this.state = { id: props.match.params.id, asset: {
      id: 0,
      value: 'tmp'
    }, mesh: null }
  }

  componentDidMount() {
    if (!this.state.id) {
      this.props.history.push(`/asset`);
    }
    this.fetchAsset();
    this.fetchMesh();
  }

  handleRetour(){
    this.props.history.push('/asset')
  }

  private async fetchAsset() {
    console.log("response")

    apiRequest(`asset/${this.state.id}`, "GET")
      .then((response) => {
        this.setState({ asset: response });
      })
      .catch((error) => console.log(error));

    if (!this.state.id) {
      this.props.history.push(`/asset`);
    }
  }

  private async fetchMesh() {
    apiRequest(`mesh/by/${this.state.id}`, "GET")
      .then((response) => {
        this.setState({ mesh: response });
      })
      .catch((error) => console.log(error));
  }

  render() {
    const defaultTab = "conso";
    let selectedTab = this.props.location.search;
    if (selectedTab) {
      const result = this.props.location.search.match(/tab=([^&]*)/);
      selectedTab = result ? result[1] : defaultTab;
      if (!["conso", "estimate"].includes(selectedTab)) {
        selectedTab = defaultTab;
      }
    }
    return (
      <main className="p-5 w-100 bg">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="p-5 form w-75 mx-auto">
          <h3 className="mb-2">
            Asset
          </h3>
          <div className="d-flex justify-content-between">
            <Table className="mt-4" striped bordered hover>
              <thead>
                <tr>
                  <td>Id</td>
                  <td>Nom</td>
                </tr>
              </thead>
              <tbody>
                  <tr>
                  <td>{this.state.asset.id}</td>
                  <td>{this.state.asset.value}</td>
                </tr>
              </tbody>
            </Table>
          </div>
          <h4 className="mb-2">
            Meshes
          </h4>
          <div className="d-flex justify-content-between">
            <Table className="mt-4" striped bordered hover>
              <thead>
                <tr>
                  <td>Id</td>
                  <td>Nom</td>
                </tr>
              </thead>
              <tbody>
                {this.state.mesh && (this.state.mesh.map((mesh: any) => (
                  <tr>
                  <td>{mesh.id}</td>
                  <td>{mesh.name}</td>
                </tr>
                )))}
              </tbody>
            </Table>
          </div>
          <Button
              onClick={this.handleRetour}
              className="d-block mx-auto mt-3 p-3"
            >
              RETOUR
            </Button>
        </div>
      </main>
    );
  }
}

export default HouseModelDetails;
