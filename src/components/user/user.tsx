import React from 'react';
import UserPolicies from './user-policies/user-policies';
import UserConfigurations from './user-configurations/user-configurations';
import { Tabs, Tab } from 'react-bootstrap';
import UserAccountDelete from './user-account-delete/user-account-delete';

class User extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <main className="p-5 w-100">
        <div>
          <Tabs
            transition={false}
            defaultActiveKey="policies"
            id="uncontrolled-tab-example"
          >
            <Tab eventKey="home" title="Mes configurations">
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

export default User;
