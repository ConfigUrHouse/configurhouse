import React from 'react';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { ConfigurationDetailsProps } from './models';
import Consommation from '../../configurator/consommation/consommation';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Estimate from '../../configurator/estimate/estimate';

class ConfigurationDetails extends React.Component<
  ConfigurationDetailsProps,
  {}
> {
  constructor(props: ConfigurationDetailsProps) {
    super(props);
  }

  render() {
    const id = parseInt(this.props.match.params.id ?? 0);
    const defaultTab = 'conso';
    let selectedTab = this.props.location.search;
    if (selectedTab) {
      const result = this.props.location.search.match(/tab=([^&]*)/);
      selectedTab = result ? result[1] : defaultTab;
      if (!['conso', 'estimate'].includes(selectedTab)) {
        selectedTab = defaultTab;
      }
    }
    return (
      <main className="p-5 w-100">
        <div>
          <Button
            variant="primary"
            href={`/configuration/${id}`}
            className="mb-2"
          >
            <FontAwesomeIcon className="mr-2" icon={faChevronLeft} />
            Retour à la configuration
          </Button>
          <Tabs
            transition={false}
            defaultActiveKey={selectedTab || defaultTab}
            id="uncontrolled-tab-example"
          >
            <Tab eventKey="conso" title="Consommation">
              <Consommation configurationId={id} />
            </Tab>
            <Tab eventKey="estimate" title="Devis détaillé">
              <Estimate confId={id} />
            </Tab>
          </Tabs>
        </div>

        <div className="circle1"></div>
        <div className="circle2"></div>
      </main>
    );
  }
}

export default withRouter(ConfigurationDetails);
