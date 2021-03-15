import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs } from "@fortawesome/free-solid-svg-icons";

class UserConfigurations extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

  }

  render() {
    return (
        <main className="p-5 w-100 bg-white m-0 user-configurations">
            <h2 className="text-green text-center"><FontAwesomeIcon icon={faCogs} /> Mes configurations</h2>
            <div className="circle1"></div>
            <div className="circle2"></div>
      </main>
    );
  }
}

export default UserConfigurations;
