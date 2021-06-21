import React from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { withRouter, useParams } from "react-router";
//import { AssetDetailsProps, AssetState } from "./models";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiRequest } from "../../../api/utils";
import queryString from 'query-string'

class HouseModelDetails extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.fetchRoles = this.fetchRoles.bind(this);
    this.state = {id: props.match.params.id, asset: null}
  }

  componentDidMount() {
    if(!this.state.id){
      this.props.history.push(`/asset`);
    }
    this.fetchRoles();
  }

  private async fetchRoles() {
    apiRequest(`asset/${this.state.id}`, "GET")
      .then((response) => {
        this.setState({asset: response});
      })
      .catch((error) => console.log(error));

      if(!this.state.id){
        this.props.history.push(`/asset`);
      }
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
      <main className="p-5 w-100">
        test
      </main>
    );
  }
}

export default HouseModelDetails;
