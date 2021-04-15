import React from 'react';
import { Button, Modal, Pagination, Table } from 'react-bootstrap';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemsTableProps, ItemsTableState } from './Models';

export class ItemsTable<T extends Record<string, any>> extends React.Component<
  ItemsTableProps<T>,
  ItemsTableState<T>
> {
  constructor(props: ItemsTableProps<T>) {
    super(props);

    this.state = {
      itemToDelete: null,
    };

    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
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
      deleteMessage,
    } = this.props;
    const hasActions = !!(handleEdit || handleDelete);

    return (
      <div className="items w-100 p-3 d-flex flex-column align-items-center">
        {handleDelete && itemToDelete && (
          <Modal show={!!itemToDelete} onHide={this.handleModalClose}>
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
        <Table bordered hover className="mt-5 text-center">
          <thead>
            <tr>
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
