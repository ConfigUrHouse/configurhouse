import React from "react";
import { faTimes, faHome, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router";
import "./assets-model-list.css";
import { ApiResponseError } from "../../../api/models";
import { ItemsTableColumn } from "../../templates/items-table/models";
import { Asset } from "../../../models";
import { AssetProps, AssetState } from "./models";
import {
  emptyPaginatedData,
  PaginatedResponse,
} from "../../../utils/pagination";
import { apiRequest } from "../../../api/utils";
import { ItemsTable } from "../../templates/items-table/items-table";
import { Button } from "react-bootstrap";

class AssetList extends React.Component<
  AssetProps,
  AssetState
> {
  private columns: ItemsTableColumn<Asset>[] = [
    {
      name: "id",
      displayName: "ID",
    },
    {
      name: "value",
      displayName: "Value",
    }
  ];

  constructor(props: AssetProps) {
    super(props);
    this.fetchRoles = this.fetchRoles.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSeeMore = this.handleSeeMore.bind(this);

    this.state = {
      paginatedItems: emptyPaginatedData<Asset>(),
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

    apiRequest("asset", "GET", queryParams)
      .then((response) => {
        if (response.status === "error") {
          this.setState({ error: response as ApiResponseError });
        } else {
          const paginatedItems = response as PaginatedResponse<Asset>;
          this.setState({ paginatedItems });
          console.log(paginatedItems)
        }
      })
      .catch((error) => console.log(error));

    this.setState({ paginatedItems: emptyPaginatedData<Asset>() });
  }

  private handleEdit(id: number): void {
    this.props.history.push(`houseModels/${id}`);
  }

  private async handleDelete(id: number): Promise<void> {
    return apiRequest(`houseModel/${id}`, "DELETE", [])
      .then((response) => {
        if (response.status === "error") {
          this.setState({ error: response as ApiResponseError });
        } else {
          this.fetchRoles();
        }
      })
      .catch((error) => console.log(error));
  }

  private deleteMessage(item: Asset): string {
    return `Voulez-vous supprimer l'asset ?`;
  }

  private handlePageChange(value: number): void {
    const paginatedItems = { ...this.state.paginatedItems };
    paginatedItems.currentPage = value;

    this.setState(
      {
        paginatedItems,
      },
      () => {
        this.fetchRoles();
      }
    );
  }

  private handleSeeMore(id: number) {
    this.props.history.push(`asset/${id}/details`);
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
              Liste des assets
            </h3>
            <Button variant="primary" href="/houseModels/add">
              <FontAwesomeIcon className="mr-2" icon={faPlus} />
              AJOUTER
            </Button>
          </div>

          <ItemsTable<Asset>
            paginatedItems={paginatedItems}
            columns={this.columns}
            handlePageChange={this.handlePageChange}
            handleEdit={this.handleEdit}
            handleDelete={this.handleDelete}
            handleSeeMore={this.handleSeeMore}
            deleteMessage={this.deleteMessage}
          />
        </div>
      </main>
    );
  }
}

export default withRouter(AssetList);
