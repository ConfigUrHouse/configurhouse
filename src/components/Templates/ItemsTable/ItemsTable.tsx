import React from "react";
import {
  Button,
  Modal,
  Dropdown,
  Form,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ItemsTableProps, ItemsTableState } from "./Models";

export class ItemsTable<T extends Record<string, any>> extends React.Component<
  ItemsTableProps<T>,
  ItemsTableState<T>
> {
  constructor(props: ItemsTableProps<T>) {
    super(props);

    this.state = {
      itemToDelete: null,
      selectedItems: [],
    };

    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.selectCurrentPage = this.selectCurrentPage.bind(this);
    this.selectAllResults = this.selectAllResults.bind(this);
    this.deselectCurrentPage = this.deselectCurrentPage.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
  }

  private async selectAllResults(): Promise<void> {
    this.setState({
      selectedItems: (await this.props.globalActions?.fetchAll()) || [],
    });
  }

  private selectCurrentPage(): void {
    const newItems: T[] = [];
    this.props.paginatedItems.items.forEach((item) => {
      if (
        !this.state.selectedItems.some(
          (selectedItem) => selectedItem.id === item.id
        )
      )
        newItems.push(item);
    });
    this.setState({ selectedItems: this.state.selectedItems.concat(newItems) });
  }

  private deselectAll(): void {
    this.setState({ selectedItems: [] });
  }

  private deselectCurrentPage(): void {
    const newItems: T[] = this.state.selectedItems;
    this.props.paginatedItems.items.forEach((item) => {
      if (
        this.state.selectedItems.some(
          (selectedItem) => selectedItem.id === item.id
        )
      ) {
        const index = this.state.selectedItems.findIndex(
          (selectedItem) => selectedItem.id === item.id
        );
        newItems.splice(index, 1);
      }
    });
    this.setState({ selectedItems: newItems });
  }

  private confirmDelete(item: T): void {
    this.setState({ itemToDelete: item });
  }

  private handleModalClose(): void {
    this.setState({ itemToDelete: null });
  }

  render() {
    const { itemToDelete } = this.state;

    const {
      columns,
      paginatedItems: { items, currentPage, totalPages },
      handlePageChange,
      handleEdit,
      handleDelete,
      globalActions,
      deleteMessage,
    } = this.props;
    const hasActions = !!(handleEdit || handleDelete);
    const canSelectItems = !!globalActions?.actions.length;

    return (
      <div className="items w-100 p-3 d-flex flex-column align-items-center">
        {handleDelete && itemToDelete && (
          <Modal show={itemToDelete} onHide={this.handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmer la suppression</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {deleteMessage
                ? deleteMessage(itemToDelete)
                : "Supprimer l'objet ?"}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleModalClose}>
                Annuler
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleDelete(itemToDelete.id);
                  this.handleModalClose();
                }}
              >
                SUPPRIMER
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        {canSelectItems && (
          <div className="w-100 p-3 mt-5 d-flex justify-content-between">
            <span className="selectedItems">
              {this.state.selectedItems.length} élément(s) sélectionné(s)
            </span>
            <span className="globalActions">
              {globalActions?.actions.map((action, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={action.icon}
                  onClick={() => action.handle(this.state.selectedItems)}
                />
              ))}
            </span>
          </div>
        )}
        <Table
          bordered
          hover
          className={`${canSelectItems ? "" : "mt-5"} text-center`}
        >
          <thead>
            <tr>
              {canSelectItems && (
                <th>
                  <Row className="d-flex align-items-center justify-content-center">
                    <Form.Check
                      name="selectAll"
                      checked={items.every((item) =>
                        this.state.selectedItems.some(
                          (selectedItem) => selectedItem.id === item.id
                        )
                      )}
                      onChange={(e: any) => {
                        if (e.target.checked) {
                          this.selectCurrentPage();
                        } else {
                          this.deselectCurrentPage();
                        }
                      }}
                    />
                    <Dropdown id="selectionDropdown">
                      <Dropdown.Toggle as="span" variant="success" />
                      <Dropdown.Menu>
                        <Dropdown.Item
                          as="button"
                          onClick={this.selectAllResults}
                        >
                          Sélectionner toutes les pages
                        </Dropdown.Item>
                        <Dropdown.Item
                          as="button"
                          onClick={this.selectCurrentPage}
                        >
                          Sélectionner cette page
                        </Dropdown.Item>
                        <Dropdown.Item
                          as="button"
                          onClick={this.deselectCurrentPage}
                        >
                          Désélectionner cette page
                        </Dropdown.Item>
                        <Dropdown.Item as="button" onClick={this.deselectAll}>
                          Désélectionner tout
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Row>
                </th>
              )}
              {columns.map((col) => (
                <th key={col.name}>{col.displayName}</th>
              ))}
              {hasActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {items?.map((item: T) => {
              return (
                <tr key={item.id}>
                  {canSelectItems && (
                    <td>
                      <Form.Check
                        name="selectOne"
                        checked={this.state.selectedItems.some(
                          (selectedItem) => selectedItem.id === item.id
                        )}
                        onChange={(e: any) => {
                          if (e.target.checked) {
                            const newItems = this.state.selectedItems;
                            newItems.push(item);
                            this.setState({ selectedItems: newItems });
                          } else {
                            const newItems = this.state.selectedItems;
                            const idx = this.state.selectedItems.findIndex(
                              (selectedItem) => selectedItem.id === item.id
                            );
                            newItems.splice(idx, 1);
                            this.setState({ selectedItems: newItems });
                          }
                        }}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={item.id + col.name}>
                      {col.component ? col.component(item) : item[col.name]}
                    </td>
                  ))}
                  {hasActions && (
                    <td>
                      {handleEdit && (
                        <FontAwesomeIcon
                          icon={faPen}
                          onClick={() => handleEdit(item.id)}
                        />
                      )}
                      {handleDelete && (
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => this.confirmDelete(item)}
                        />
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Pagination>
          <Pagination.First
            disabled={currentPage === 0}
            onClick={() => handlePageChange(0)}
          />
          <Pagination.Prev
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          <Pagination.Item active>{currentPage + 1}</Pagination.Item>
          <Pagination.Next
            disabled={!totalPages || currentPage === totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
          />
          <Pagination.Last
            disabled={!totalPages || currentPage === totalPages - 1}
            onClick={() => handlePageChange(totalPages - 1)}
          />
        </Pagination>
      </div>
    );
  }
}
