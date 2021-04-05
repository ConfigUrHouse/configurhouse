import React from "react";
import { Dropdown, Form, Pagination, Row, Table } from "react-bootstrap";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ItemsTableProps, ItemsTableState } from "./Models";

export class ItemsTable<T extends Record<string, any>> extends React.Component<
  ItemsTableProps<T>,
  ItemsTableState<T>
> {
  constructor(props: ItemsTableProps<T>) {
    super(props);

    this.selectCurrentPage = this.selectCurrentPage.bind(this);
    this.selectAllResults = this.selectAllResults.bind(this);
    this.deselectCurrentPage = this.deselectCurrentPage.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
  }

  public readonly state: ItemsTableState<T> = {
    selectedItems: [],
  };

  async selectAllResults() {
    this.setState({
      selectedItems: (await this.props.globalActions?.fetchAll()) || [],
    });
  }

  selectCurrentPage() {
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

  deselectAll() {
    this.setState({ selectedItems: [] });
  }

  deselectCurrentPage() {
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

  render() {
    const {
      columns,
      paginatedItems: { items, currentPage, totalPages },
      handlePageChange,
      handleEdit,
      handleDelete,
      globalActions,
    } = this.props;
    const hasActions = !!(handleEdit || handleDelete);
    const canSelectItems = !!globalActions?.actions.length;

    const globalActionsDiv = (
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
    );

    const selectionColumn = (
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
              <Dropdown.Item as="button" onClick={this.selectAllResults}>
                Sélectionner toutes les pages
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={this.selectCurrentPage}>
                Sélectionner cette page
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={this.deselectCurrentPage}>
                Désélectionner cette page
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={this.deselectAll}>
                Désélectionner tout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Row>
      </th>
    );

    const selectOneCheckbox = (item: T) => (
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
    );

    return (
      <div className="items w-100 p-3 d-flex flex-column align-items-center">
        {canSelectItems && globalActionsDiv}
        <Table
          bordered
          hover
          className={`${canSelectItems ? "" : "mt-5"} text-center`}
        >
          <thead>
            <tr>
              {canSelectItems && selectionColumn}
              {columns.map((col) => (
                <th key={col.name}>{col.displayName}</th>
              ))}
              {hasActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item: T) => {
              return (
                <tr key={item.id}>
                  {canSelectItems && selectOneCheckbox}
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
                          onClick={() => handleDelete(item.id)}
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
