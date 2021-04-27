import React from "react";
import UserPolicies from "./user-policies/user-policies";
import UserConfigurations from "./user-configurations/user-configurations";
import { Tabs, Tab } from "react-bootstrap";
import UserAccountDelete from "./user-account-delete/user-account-delete";
import { UserProps, UserState } from "./models";
import { withRouter } from "react-router";

class User extends React.Component<UserProps, UserState> {
  constructor(props: UserProps) {
    super(props);
  }

  render() {
    const defaultTab = "policies";
    let selectedTab = this.props.location.search;
    if (selectedTab) {
      const result = this.props.location.search.match(/tab=([^&]*)/);
      selectedTab = result ? result[1] : defaultTab;
      if (!["configs", "policies", "accountdelete"].includes(selectedTab)) {
        selectedTab = defaultTab;
      }
    }

    return (
      <main className="p-5 w-100">
        <div>
          <Tabs
            transition={false}
            defaultActiveKey={selectedTab || defaultTab}
            id="uncontrolled-tab-example"
          >
            <Tab eventKey="configs" title="Mes configurations">
              <UserConfigurations />
            </Tab>
            <Tab eventKey="policies" title="Mes politiques de confidentialité">
              <UserPolicies />
            </Tab>
            <Tab
              eventKey="accountdelete"
              title="Demande de suppression du compte"
            >
              <UserAccountDelete />
            </Tab>
          </Tabs>
        </div>

        <div className="circle1"></div>
        <div className="circle2"></div>
      </main>
    );
  }
}

export default withRouter(User);
