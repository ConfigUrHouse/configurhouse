import React from 'react';
import { faTimes, faHome, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router';
import { ApiResponseError } from '../../../api/models';
import { ItemsTableColumn } from '../../templates/items-table/models';
import { ConfigurationOption } from '../../../models';
import {
  ConfigurationOptionListProps,
  ConfigurationOptionListState,
} from './models';
import {
  emptyPaginatedData,
  PaginatedResponse,
} from '../../../utils/pagination';
import { apiRequest } from '../../../api/utils';
import { ItemsTable } from '../../templates/items-table/items-table';
import { Button } from 'react-bootstrap';
import './configuration-option-list.css';

class ConfigurationOptionList extends React.Component<
  ConfigurationOptionListProps,
  ConfigurationOptionListState
> {
  private columns: ItemsTableColumn<ConfigurationOption>[] = [
    {
      name: 'id',
      displayName: 'ID',
    },
    {
      name: 'name',
      displayName: 'Nom',
    },
    {
      name: 'modelType',
      displayName: 'Modèle',
      component(item) {
        return item.houseModel?.name ?? 'Inconnu';
      },
    },
    {
      name: 'mesh',
      displayName: 'Mesh',
      component(item) {
        return item.mesh?.name ?? 'Inconnu';
      },
    },
  ];

  constructor(props: ConfigurationOptionListProps) {
    super(props);
    this.fetchConfigurationOptions = this.fetchConfigurationOptions.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);

    this.state = {
      paginatedItems: emptyPaginatedData<ConfigurationOption>(),
      error: undefined,
    };
  }

  componentDidMount() {
    this.fetchConfigurationOptions();
  }

  // Loads the list of options
  private async fetchConfigurationOptions() {
    const {
      paginatedItems: { currentPage },
    } = this.state;

    const queryParams = [`page=${currentPage}`, `size=10`];

    apiRequest('optionConf', 'GET', queryParams)
      .then((response) => {
        if (response.status === 'error') {
          this.setState({ error: response as ApiResponseError });
        } else {
          const paginatedItems =
            response as PaginatedResponse<ConfigurationOption>;
          this.setState({ paginatedItems });
        }
      })
      .catch((error) => console.log(error));

    this.setState({
      paginatedItems: emptyPaginatedData<ConfigurationOption>(),
    });
  }

  private handleEdit(id: number): void {
    this.props.history.push(`configurationOptions/${id}`);
  }

  private async handleDelete(id: number): Promise<void> {
    try {
      const response = await apiRequest(`optionConf/${id}`, 'DELETE', []);

      if (response.status === 'error') {
        this.setState({ error: response as ApiResponseError });
      } else {
        this.fetchConfigurationOptions();
      }
    } catch (error) {
      console.log(error);
    }
  }

  private deleteMessage = (item: ConfigurationOption) =>
    `Voulez-vous supprimer l'option ${item.name} ?`;

  private handlePageChange(value: number): void {
    const paginatedItems = { ...this.state.paginatedItems };
    paginatedItems.currentPage = value;

    this.setState(
      {
        paginatedItems,
      },
      this.fetchConfigurationOptions
    );
  }

  render() {
    const { paginatedItems } = this.state;
    return (
      <main className='p-5 w-100 bg'>
        <div className='circle1'></div>
        <div className='circle2'></div>
        <div className='p-5 form w-75 mx-auto'>
          {this.state.error && (
            <div className='alert alert-danger m-4'>
              <FontAwesomeIcon icon={faTimes} />
              Une erreur est survenue :
              <p>Message : {this.state.error.message}</p>
            </div>
          )}
          <div className='d-flex justify-content-between'>
            <h3 className='mb-2'>
              <FontAwesomeIcon className='mr-2' icon={faHome} />
              Liste des options de configurations
            </h3>
            <Button variant='primary' href='/configurationOptions/add'>
              <FontAwesomeIcon className='mr-2' icon={faPlus} />
              AJOUTER
            </Button>
          </div>

          <ItemsTable<ConfigurationOption>
            paginatedItems={paginatedItems}
            columns={this.columns}
            handlePageChange={this.handlePageChange}
            handleEdit={this.handleEdit}
            handleDelete={this.handleDelete}
            deleteMessage={this.deleteMessage}
          />
        </div>
      </main>
    );
  }
}

export default withRouter(ConfigurationOptionList);
