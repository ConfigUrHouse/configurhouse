import React from "react";
import { faTimes, faHome, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router";
import "./house-model-list.css";
import { ApiResponseError } from "../../../api/models";
import { ItemsTableColumn } from "../../templates/items-table/models";
import { HouseModel } from "../../../models";
import { HouseModelsProps, HouseModelsState } from "./models";
import {
  emptyPaginatedData,
  PaginatedResponse,
} from "../../../utils/pagination";
import { apiRequest } from "../../../api/utils";
import { ItemsTable } from "../../templates/items-table/items-table";
import { Button } from "react-bootstrap";

class HouseModelList extends React.Component<
  HouseModelsProps,
  HouseModelsState
> {
  private columns: ItemsTableColumn<HouseModel>[] = [
    {
      name: "id",
      displayName: "ID",
    },
    {
      name: "name",
      displayName: "Nom",
    },
    {
      name: "modelType",
      displayName: "Type de Modèle",
      component(item) {
        return item.modelType?.name ?? "Inconnu";
      },
    },
  ];

  constructor(props: HouseModelsProps) {
    super(props);
    this.fetchHouseModels = this.fetchHouseModels.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSeeMore = this.handleSeeMore.bind(this);

    this.state = {
      paginatedItems: emptyPaginatedData<HouseModel>(),
      error: undefined,
    };
  }

  componentDidMount() {
    this.fetchHouseModels();
  }

  private async fetchHouseModels() {
    const {
      paginatedItems: { currentPage },
    } = this.state;

    const queryParams = [`page=${currentPage}`, `size=10`];

    apiRequest("houseModel", "GET", queryParams)
      .then((response) => {
        if (response.status === "error") {
          this.setState({ error: response as ApiResponseError });
        } else {
          const paginatedItems = response as PaginatedResponse<HouseModel>;
          this.setState({ paginatedItems });
        }
      })
      .catch((error) => console.log(error));

    this.setState({ paginatedItems: emptyPaginatedData<HouseModel>() });
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
          this.fetchHouseModels();
        }
      })
      .catch((error) => console.log(error));
  }

  private deleteMessage(item: HouseModel): string {
    return `Voulez-vous supprimer le modèle ${item.name} ?`;
  }

  private handlePageChange(value: number): void {
    const paginatedItems = { ...this.state.paginatedItems };
    paginatedItems.currentPage = value;

    this.setState(
      {
        paginatedItems,
      },
      () => {
        this.fetchHouseModels();
      }
    );
  }

  private handleSeeMore(id: number) {
    this.props.history.push(`houseModels/${id}/details`);
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
              Liste des modèles
            </h3>
            <Button variant="primary" href="/houseModels/add">
              <FontAwesomeIcon className="mr-2" icon={faPlus} />
              AJOUTER
            </Button>
          </div>

          <ItemsTable<HouseModel>
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

export default withRouter(HouseModelList);
