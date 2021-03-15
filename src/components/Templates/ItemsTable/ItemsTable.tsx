import React from 'react';
import { Button, Form, Pagination, Table } from 'react-bootstrap';
import {
  faCheck,
  faTimes,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemsTableProps } from './Models';

export class ItemsTable<T> extends React.Component<ItemsTableProps<T>, {}> {
  constructor(props: ItemsTableProps<T>) {
    super(props);
  }

  render() {
    const {
      columns,
      paginatedItems: { items, currentPage, totalPages },
      handlePageChange,
      handleEdit,
      handleDelete,
    } = this.props;
    const hasActions = !!(handleEdit || handleDelete);

    return (
      <div className="items w-100 p-3 d-flex flex-column align-items-center">
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
            {items.map((i) => {
              const item = i as any;
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
            disabled={currentPage === totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
          />
          <Pagination.Last
            disabled={currentPage === totalPages - 1}
            onClick={() => handlePageChange(totalPages - 1)}
          />
        </Pagination>
      </div>
    );
  }
}
