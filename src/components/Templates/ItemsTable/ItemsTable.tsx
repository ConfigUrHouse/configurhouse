import React from 'react';
import { Form, Pagination, Table } from 'react-bootstrap';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemsTableProps, ItemsTableState } from './Models';

export class ItemsTable<T extends Record<string, any>> extends React.Component<
  ItemsTableProps<T>,
  ItemsTableState<T>
> {
  constructor(props: ItemsTableProps<T>) {
    super(props);
  }

  public readonly state: ItemsTableState<T> = {
    selectedItems: []
  }

  render() {
    const {
      columns,
      paginatedItems: { items, currentPage, totalPages },
      handlePageChange,
      handleEdit,
      handleDelete,
      globalActions
    } = this.props;
    const hasActions = !!(handleEdit || handleDelete);
    const canSelectItems = !!globalActions?.length

    return (
      <div className="items w-100 p-3 d-flex flex-column align-items-center">
        {canSelectItems && <div className="w-100 p-3 mt-5 d-flex justify-content-between">
          <span className="selectedItems">
            {this.state.selectedItems.length} élément(s) sélectionné(s)
          </span>
          <span className="globalActions">
            {globalActions?.map((action,index) =>
              <FontAwesomeIcon key={index} icon={action.icon} onClick={() => action.handle(this.state.selectedItems)}/>
            )}
          </span>
        </div>}
        <Table bordered hover className={`${canSelectItems ? "" : "mt-5"} text-center`}>
          <thead>
            <tr>
              {canSelectItems && <th>
                <Form.Check
                  name="selectAll"
                  onChange={(e: any) => {
                    if (e.target.checked) {
                      const newItems: T[] = []
                      items.forEach(item => {
                        if (!this.state.selectedItems.includes(item)) newItems.push(item)
                      })
                      this.setState({ selectedItems: this.state.selectedItems.concat(newItems) })
                    }
                    else {
                      this.setState({ selectedItems: [] })
                    }
                  }}
                /></th>}
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
                  {canSelectItems && <td>
                    <Form.Check
                      name="selectOne"
                      checked={this.state.selectedItems.includes(item)}
                      onChange={(e: any) => {
                        if (e.target.checked) {
                          const newItems = this.state.selectedItems;
                          newItems.push(item);
                          this.setState({ selectedItems: newItems });
                        }
                        else {
                          const newItems = this.state.selectedItems;
                          const idx = this.state.selectedItems.indexOf(item);
                          newItems.splice(idx, 1);
                          this.setState({ selectedItems: newItems });
                        }
                      }}
                    />
                  </td>}
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
