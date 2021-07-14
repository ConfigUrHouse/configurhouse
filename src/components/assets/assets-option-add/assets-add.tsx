import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faHome, faPlus } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { apiRequest } from '../../../api/utils';
import { ApiResponseError } from '../../../api/models';
import { Button, Form, Row } from 'react-bootstrap';
import { useParams, withRouter } from 'react-router';
import * as Yup from 'yup';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class AssetAdd extends React.Component<any, any> {
  private schema = Yup.object().shape({
    file: Yup.mixed().required(),
  });

  private fileInput: any;

  constructor(props: any) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.fetchAssetType = this.fetchAssetType.bind(this);
    this.fileInput = React.createRef();

    this.state = {
      assetTypes: [],
      error: undefined,
    };
  }

  componentDidMount() {
    this.fetchAssetType();
  }

  async fetchAssetType(): Promise<void> {
    try {
      const response: any = await apiRequest(`assetType`, 'GET', []);
      this.setState({ assetTypes: response });
    } catch (error: any) {
      console.error(error);
      this.setState({ error: error as ApiResponseError });
    }
  }

  submitForm(event: any) {
    const history: any = this.props.history;

    if (this.fileInput?.current?.files?.[0]?.name?.includes('.glb')) {
      const assetType = this.state.assetTypes.filter(
        (element: any) => element.name == 'Model'
      )[0];

      var myHeaders: any = new Headers();
      myHeaders.append(
        'Authorization',
        `Bearer ${
          window.localStorage.getItem('token') || 'myVerySecretAdminToken'
        }`
      );

      var formdata: any = new FormData();
      formdata.append(
        'file',
        this.fileInput?.current?.files?.[0],
        this.fileInput?.current?.files?.[0].name
      );
      formdata.append('id_AssetType', assetType.id);

      var requestOptions: any = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${process.env.REACT_APP_API_BASE_URL}/asset`, requestOptions)
        .then((response) => response.json())
        .then((result: any) => {
          let file = this.fileInput?.current?.files?.[0];
          let reader = new FileReader();

          reader.onload = function (gltfText: any) {
            console.log(gltfText.target.result);

            const gltfLoader = new GLTFLoader();
            gltfLoader.parse(gltfText.target.result, '', (gltf: any) => {
              const promise: Promise<any>[] = [];

              gltf?.scene?.children?.forEach((parent: any) => {
                if (parent.children.length == 0) {
                  promise.push(
                    apiRequest(`mesh`, 'POST', '', {
                      name: parent.name,
                      id_Asset: result.id,
                      same: false,
                    })
                  );
                } else {
                  parent.children.forEach((child: any) => {
                    promise.push(
                      apiRequest(`mesh`, 'POST', '', {
                        name: child.name,
                        id_Asset: result.id,
                        same: true,
                      })
                    );
                  });
                }
              });

              Promise.allSettled(promise).then(() => {
                history.push(`/asset/${result.id}/details`);
              });
            });
          };

          reader.readAsArrayBuffer(file);
        })
        .catch((error) => console.log('error', error));
    } else {
      this.setState({ error: 'Vous ne pouvez importer que des fichiers glb.' });
    }

    event.preventDefault();
  }

  render() {
    return (
      <main className="p-5 w-100 bg">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="p-5 form w-75 mx-auto">
          {this.state.error && (
            <div className="alert alert-danger m-4">
              <FontAwesomeIcon icon={faTimes} />
              <span> </span>Une erreur est survenue :
              <p>Message : {this.state.error}</p>
            </div>
          )}
          <Form onSubmit={this.submitForm}>
            <Row>
              <Form.File
                id="custom-file"
                label="Custom file input"
                ref={this.fileInput}
                custom
              />
            </Row>
            <Button
              variant="primary"
              className="d-block mx-auto mt-3 p-3"
              type="submit"
            >
              AJOUTER <FontAwesomeIcon className="ml-2" icon={faSave} />
            </Button>
          </Form>
        </div>
      </main>
    );
  }
}

export default withRouter(AssetAdd);
