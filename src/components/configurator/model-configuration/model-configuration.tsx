import React from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import './model-configuration.css';
import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useParams, withRouter } from "react-router";
import { OrbitControls } from '@react-three/drei/core/OrbitControls';
import { proxy, useProxy } from 'valtio';
import { ApiResponseError } from '../../../api/models';
import { apiRequest } from '../../../api/utils';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface test {
  items: any;
}

const objectTest: test = {
  items: {
    same: true
  },
};

const state = proxy(objectTest);

function modelLoader(file: any) {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.parse(file, '', data => resolve(data));
  });
}

function Model(props: any) {
  const ref = useRef()
  const snap = useProxy(state)

  const geometry: any[] = [];

  props?.model?.scene?.children?.forEach((parent: any) => {

    if (parent.children.length == 0) {
      geometry.push(<mesh key={parent.id} castShadow receiveShadow geometry={parent.geometry} material={parent.material} material-color={snap.items[parent.name]} />)
    }
    else {
      parent.children.forEach((child: any) => {
        geometry.push(<mesh key={child.id} visible={snap.items.same} castShadow receiveShadow geometry={child.geometry} material={child.material} />)
      })
    }
  });

  return (
    <group
      ref={ref}
      castShadow
      receiveShadow
      dispose={null}>
      {geometry && (geometry.map((mesh: any) => (
        mesh
      )))}
    </group>
  );
}

class ModelConfiguration extends React.Component<any, any> {
  constructor(props: any) {
    //TODO: use this.props.updateOptionValues() + fetch conso on dropdown change
    super(props);

    this.fetchModel = this.fetchModel.bind(this);
    this.fetchConso = this.fetchConso.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    const id = parseInt(props.match.params.id ?? 0);

    this.state = {
      confId: id,
      error: undefined,
      editMode: id !== 0,
      conso: undefined,
      model: undefined,
      options: undefined,
      savedValue: []
    };
  }

  async fetchModel() {

    if(this.state.editMode){
      const conf: any = await apiRequest(
        `configuration/${this.state.confId}`,
        "GET",
        []
      );

      console.log(conf)

      let mapped: any = await Promise.all(conf?.configurationValues?.map(async (element: any) => {
          const val: any = await apiRequest(
            `value/${element.id_Value}`,
            "GET",
            []
          );
          return {
            ...element,
            value: {
              ...val
            }
          }
      }));

      mapped = await Promise.all(mapped.map(async (element: any) => {
          const val: any = await apiRequest(
            `optionConf/${element.value.id_OptionConf}`,
            "GET",
            []
          );
          return {
            ...element,
            optionConf: {
              ...val
            }
          }
      }));

      mapped = await Promise.all(mapped.map(async (element: any) => {
          const val: any = await apiRequest(
            `mesh/${element.optionConf.id_Mesh}`,
            "GET",
            []
          );
          return {
            ...element,
            mesh: {
              ...val
            }
          }
      }));

      conf.configurationValues = mapped;
      
      const tmpArray: any[] = [];

      conf?.configurationValues?.forEach((element: any) => {
        tmpArray.push(element.id_Value)
        state.items[element.mesh.name] = element.value.value;
      });
      this.setState({savedValue: tmpArray});
      
      console.log(this.state.savedValue)
    }

    const opc: any = await apiRequest(
      `optionConf/by/${this.props.model.id}`,
      "GET",
      []
    );

    let items: any = await Promise.all(opc.map(async(element: any) => {
      const values: any = await apiRequest(
        `value/byOption/${element.id}`,
        "GET",
        []
      );
      return {
        ...element,
        values
      }
    }));

    items = await Promise.all(items.map(async(element: any) => {
      const values: any = await apiRequest(
        `mesh/${element.id_Mesh}`,
        "GET",
        []
      );
      return {
        ...element,
        same: values.same,
        nameMesh: values.name,
        id_Asset: values.id_Asset
      }
    }));

    this.setState({options: items});

    if(!opc[0]){
      this.props.history.push('/');
    }

    const hml: any = await apiRequest(
      `housemodel/${opc[0].id_HouseModel}`,
      "GET",
      []
    );
    const msh: any = await apiRequest(
      `mesh/by/${hml.id_Asset}`,
      "GET",
      []
    );
    msh.forEach((value: any) => {
      if(!value.same && !state.items[value.name])
        state.items[value.name] = '#FFFFFF';
    });

    const REACT_APP_API_BASE_URL: any = process.env.REACT_APP_API_BASE_URL;
    const objectJson: any = await apiRequest(
      `asset/${hml.id_Asset}`,
      "GET",
      []
    );
    const file: any = await fetch(`${REACT_APP_API_BASE_URL}/${objectJson.value}`, {
      method: 'GET',
    })
      .then(response => response.arrayBuffer())
      .catch(error => console.log('error', error));


    const model: any = await modelLoader(file);

    this.setState({ model: model });
  }

  handleSelect(event: any) {
    let id = event.target.id;
    let val = event.target.value;
    state.items[id] = val;

    const index = event.target.selectedIndex;
    const optionElement = event.target.childNodes[index];
    const optionElementId = optionElement.getAttribute('id');
    console.log(event.target.name, optionElementId);

    const tmpArray = [...this.state.savedValue];
    tmpArray[event.target.name] = Number(optionElementId);
    this.setState({savedValue: tmpArray});

    this.props.updateOptionValues(tmpArray);
  }

  handleChangeCB(event: any) {
    let val = event.target.checked;
    state.items.same = val;
  }

  async fetchConso() {
    try {
      const response = await apiRequest(
        `houseModel/${this.props.model.id}/conso`,
        'POST',
        '',
        {
          valueIds: this.props.optionValues,
        }
      );
      if (response.status === 'error') {
        this.setState({ error: response as ApiResponseError });
      } else {
        this.setState({ conso: response });
      }
    } catch (error) {
      console.log(error);
      this.setState({ error: error as ApiResponseError });
    }
  }

  componentDidMount() {
    this.fetchConso();
    this.fetchModel();
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={8} className='col'>
            <div className='content CanvaContainer'>
              <h5>Visualisation du modèle {this.props.model.name}</h5>
              <Canvas
                shadows
                className='Canva'
                camera={{ position: [0, 0, 12], fov: 60 }}
              >
                <spotLight
                  shadow-mapSize-width={5120}
                  shadow-mapSize-height={5120}
                  shadowBias={-0.0000005}
                  intensity={0.75}
                  angle={0.1}
                  penumbra={1}
                  position={[40, 80, 40]}
                  castShadow
                />
                <ambientLight intensity={0.45} />
                <Suspense fallback={null}>
                  <Model model={this.state.model} />
                </Suspense>
                <OrbitControls
                  minPolarAngle={-Math.PI}
                  maxPolarAngle={Math.PI / 2}
                  minAzimuthAngle={-Math.PI / 7}
                  maxAzimuthAngle={Math.PI / 7}
                />
              </Canvas>
            </div>
          </Col>
          <Col md={4} className="col">
            <div className="content options">
              <h5 className="text-light">Options</h5>
              {this.state.options && this.state.options.map((option: any, index: any) => (
                <Form.Group key={option.id} controlId={option.nameMesh}>
                  <Form.Label>{option.name}</Form.Label>
                  <Form.Control name={index} defaultValue={state.items[option.nameMesh]} onChange={this.handleSelect} as="select">
                      <option key={0} value="#FFFFFF">Sélectionner une option</option>
                    {option.values && option.values.map((value: any) => (
                      <option id={value.id} key={value.id} value={value.value}>{value.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                ))}
              <Form>
                
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check
                    defaultChecked={state.items.same}
                    onChange={this.handleChangeCB}
                    type='checkbox'
                    label='Meubles'
                  />
                </Form.Group>
              </Form>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={4} className='col devis'>
            <div className='content text-center'>
              <h5>Aperçu du devis</h5>
              <Row className='mb-0'>
                <Col>
                  <h6>Modèle</h6>
                  <p className='price'>10 343,56</p>
                </Col>
                <Col>
                  <h6>Options</h6>
                  <p className='price'>{(10343.56).toLocaleString('fr-FR')}</p>
                </Col>
              </Row>
              <div className='total price'>34 343,23</div>
            </div>
          </Col>
          <Col md={4} className='col conso'>
            <div className='content text-center'>
              <h5>Aperçu de la consommation</h5>
              <div className='conso-data'>
                {this.state.conso && this.state.conso.global && (
                  <div className='percentage'>
                    {this.state.conso.global.diffPercentage}
                  </div>
                )}
                <div className='conso-label'>
                  d'économie par rapport à un logement de référence.
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(ModelConfiguration);
