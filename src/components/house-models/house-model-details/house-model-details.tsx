import React from "react";
import { Button, Tab, Tabs } from "react-bootstrap";
import { withRouter } from "react-router";
import { HouseModelDetailsProps } from "./models";
import Consommation from "../../configurator/consommation/consommation";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Estimate from "../estimate/estimate";

class HouseModelDetails extends React.Component<HouseModelDetailsProps, {}> {
  constructor(props: HouseModelDetailsProps) {
    super(props);
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
        <div>
          <Button variant="primary" href={`/houseModels`} className="mb-2">
            <FontAwesomeIcon className="mr-2" icon={faChevronLeft} />
            Retour à la liste des modèles
          </Button>
          <Tabs
            transition={false}
            defaultActiveKey={selectedTab || defaultTab}
            id="uncontrolled-tab-example"
          >
            <Tab eventKey="conso" title="Consommation">
              <Consommation />
            </Tab>
            <Tab eventKey="estimate" title="Devis détaillé">
              <Estimate />
            </Tab>
          </Tabs>
        </div>

        <div className="circle1"></div>
        <div className="circle2"></div>
      </main>
    );
  }
}

export default withRouter(HouseModelDetails);
