import React from "react";
import { faTimes, faHome, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router";
import { ApiResponseError } from "../../api/models";
import { ItemsTableColumn } from "../templates/items-table/models";
import { Role } from "../../models";
import {
    RoleListProps,
    RoleListState,
  } from "./models";
import {
  emptyPaginatedData,
  PaginatedResponse,
} from "../../utils/pagination";
import { apiRequest } from "../../api/utils";
import { ItemsTable } from "../templates/items-table/items-table";
import { Button } from "react-bootstrap";
import "./role.css";

class UserRoleList extends React.Component<
    RoleListProps,
    RoleListState
> {
  private columns: ItemsTableColumn<Role>[] = [
    {
      name: "id",
      displayName: "ID",
    },
    {
      name: "name",
      displayName: "Nom",
    },
    {
        name: "description",
        displayName: "Description",
      }
  ];

  constructor(props: RoleListProps) {
    super(props);
    this.handlePageChange = this.handlePageChange.bind(this);

    this.state = {
      paginatedItems: emptyPaginatedData<Role>(),
      error: undefined,
    };
  }

  componentDidMount() {
    this.fetchRoles();
  }

  private async fetchRoles() {
    const {
      paginatedItems: { currentPage },
    } = this.state;

    const queryParams = [`page=${currentPage}`, `size=10`];

    apiRequest("role", "GET", queryParams)
      .then((response) => {

        console.log(response)

        if (response.status === "error") {
          this.setState({ error: response as ApiResponseError });
        } else {
          const paginatedItems = response as PaginatedResponse<Role>;
          this.setState({ paginatedItems });
        }
      })

    this.setState({
      paginatedItems: emptyPaginatedData<Role>(),
    });
  }

  private handlePageChange(value: number): void {
    const paginatedItems = { ...this.state.paginatedItems };
    paginatedItems.currentPage = value;

    this.setState(
      {
        paginatedItems,
      },
      this.fetchRoles
    );
  }

  render() {
    const { paginatedItems } = this.state;
    return (
      <main className="p-5 w-100 bg">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="p-5 form w-75 mx-auto">
          {this.state.error && (
            <div className="alert alert-danger m-4">
              <FontAwesomeIcon icon={faTimes} />
              Une erreur est survenue :
              <p>Message : {this.state.error.message}</p>
            </div>
          )}
          <div className="d-flex justify-content-between">
            <h3 className="mb-2">
              <FontAwesomeIcon className="mr-2" icon={faHome} />
              Liste des rôles
            </h3>
          </div>

          <ItemsTable<Role>
            paginatedItems={paginatedItems}
            columns={this.columns}
            handlePageChange={this.handlePageChange}
          />
        </div>
      </main>
    );
  }
}

export default withRouter(UserRoleList);
