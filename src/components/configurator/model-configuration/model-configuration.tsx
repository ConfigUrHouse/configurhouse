import React from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import './model-configuration.css';
import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei/core/useGLTF';
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
    MurCote: '#ffffff',
    MurFond: '#ffffff',
    Sol: '#ffffff',
    Meuble: true,
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
      //geometry.push(<mesh castShadow receiveShadow geometry={parent.geometry} material={parent.material} material-color={snap.items.MurCote} />)
      geometry.push(<mesh key={parent.id} castShadow receiveShadow geometry={parent.geometry} material={parent.material} />)
    }
    else {
      parent.children.forEach((child: any) => {
        geometry.push(<mesh key={child.id} castShadow receiveShadow geometry={child.geometry} material={child.material} />)
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

    this.state = {
      error: undefined,
      conso: undefined,
      model: undefined
    };
  }

  async fetchModel() {

    const REACT_APP_API_BASE_URL: any = process.env.REACT_APP_API_BASE_URL;
    const objectJson: any = await apiRequest(
      `asset/14`,
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

  handleSelectMurCote(event: any) {
    let val = event.target.value;
    state.items.MurCote = val;
  }

  handleSelectMurFond(event: any) {
    let val = event.target.value;
    state.items.MurFond = val;
  }

  handleChangeCB(event: any) {
    let val = event.target.checked;
    state.items.Meuble = val;
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
          <Col md={4} className='col'>
            <div className='content options'>
              <h5 className='text-light'>Options</h5>
              <Form>
                <Form.Group controlId='exampleForm.ControlSelect1'>
                  <Form.Label>Mur côté</Form.Label>
                  <Form.Control onChange={this.handleSelectMurCote} as='select'>
                    <option value='#ffffff'>Blanc</option>
                    <option value='#ff0000'>Rouge</option>
                    <option value='#00ff00'>Vert</option>
                    <option value='#0000ff'>Bleu</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId='exampleForm.ControlSelect2'>
                  <Form.Label>Mur fond</Form.Label>
                  <Form.Control onChange={this.handleSelectMurFond} as='select'>
                    <option value='#ffffff'>Blanc</option>
                    <option value='#ff0000'>Rouge</option>
                    <option value='#00ff00'>Vert</option>
                    <option value='#0000ff'>Bleu</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId='formBasicCheckbox'>
                  <Form.Check
                    defaultChecked={state.items.Meuble}
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

export default ModelConfiguration;
