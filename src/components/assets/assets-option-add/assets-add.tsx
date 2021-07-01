import {
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import React from "react";
import { apiRequest } from "../../../api/utils";
import { ApiResponseError } from "../../../api/models";
import {
  Button,
  Form,
  Row,
} from "react-bootstrap";
import { useParams, withRouter } from "react-router";
import * as Yup from "yup";

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
    };
  }

  componentDidMount() {
    this.fetchAssetType();
  }

  async fetchAssetType(): Promise<void> {
    try {
      const response: any = await apiRequest(
        `assetType`,
        "GET",
        []
      );
      this.setState({ assetTypes: response });
    } catch (error: any) {
      console.error(error);
      this.setState({ error: error as ApiResponseError });
    }
  }

  submitForm(event: any) {
    const assetType = this.state.assetTypes.filter((element : any) => element.name == "Model")[0];
    console.log(assetType);
    alert(
      `Fichier sélectionné - ${        this.fileInput.current.files[0].name
      }`
    );
    event.preventDefault();
  }

  render() {
    return (
      <main className="p-5 w-100 bg">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="p-5 form w-75 mx-auto">
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
