import React from "react";
import { Col, Row, Form, Table, Button } from "react-bootstrap";
import "./model-configuration.css";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from '@react-three/drei/core/useGLTF';
import { OrbitControls } from '@react-three/drei/core/OrbitControls';
import { ContactShadows } from '@react-three/drei/core/ContactShadows';
import { HexColorPicker } from "react-colorful"
import { proxy, useProxy } from "valtio"
import { ApiResponseError } from "../../../api/models";
import { apiRequest } from '../../../api/utils';

interface test {
  items: any
} 

const objectTest : test = {
  items: {
    MurCote: "#ffffff",
    MurFond: "#ffffff",
    Sol: "#ffffff",
    Meuble: true
  },
}

const state = proxy(objectTest);

function Shoe() {
  const ref = useRef()
  const snap = useProxy(state)
  const { nodes, materials } = useGLTF("Test9.glb") as any

  return (
    <group
      ref={ref}
      castShadow
      receiveShadow
      dispose={null}>
      <mesh castShadow receiveShadow geometry={(nodes.MurCote as any).geometry} material={(nodes.MurCote as any).material}  material-color={snap.items.MurCote}/>
      <mesh castShadow receiveShadow geometry={(nodes.MurFond as any).geometry} material={(nodes.MurFond as any).material} material-color={snap.items.MurFond}/>
      <mesh castShadow receiveShadow geometry={(nodes.Sol as any).geometry} material={(nodes.Sol as any).material} material-color={snap.items.Sol}/>
      <mesh visible={snap.items.Meuble} castShadow receiveShadow geometry={(nodes.Cylinder010 as any).geometry} material={(nodes.Cylinder010 as any).material} />
      <mesh visible={snap.items.Meuble} castShadow receiveShadow geometry={(nodes.Cylinder010_1 as any).geometry} material={(nodes.Cylinder010_1 as any).material} />
      <mesh visible={snap.items.Meuble} castShadow receiveShadow geometry={(nodes.Cylinder010_2 as any).geometry} material={(nodes.Cylinder010_2 as any).material} />
      <mesh visible={snap.items.Meuble} castShadow receiveShadow geometry={(nodes.Cylinder010_3 as any).geometry} material={(nodes.Cylinder010_3 as any).material} />
    </group>
  )
}


class ModelConfiguration extends React.Component<any, any> {
  constructor(props: any) {
    //TODO: use this.props.updateOptionValues() + fetch conso on dropdown change
    super(props);
    this.state = {
      error: undefined,
      conso: undefined,
    };
  }

  handleSelectMurCote(event : any) {
    let val = event.target.value;
    console.log(val);
    state.items.MurCote = val;
  }

  handleSelectMurFond(event : any) {
    let val = event.target.value;
    console.log(val);
    state.items.MurFond = val;
  }

  handleChangeCB(event: any) {
    let val = event.target.checked;
    console.log(val);
    state.items.Meuble = val;
  }

  async fetchConso() {
    try {
      const response = await apiRequest(
        `houseModel/${this.props.model.id}/conso`,
        "POST",
        "",
        {
          valueIds: this.props.optionValues,
        }
      );
      if (response.status === "error") {
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

  }

  render() {
    return (
      <div>
        <Row>
          <Col md={8} className="col">
            <div className="content CanvaContainer">
              <h5>Visualisation du modèle {this.props.model.name}</h5>
              <Canvas shadows className="Canva" camera={{ position: [0, 0, 12], fov: 60  }}>
                <spotLight shadow-mapSize-width={5120} shadow-mapSize-height={5120} shadowBias={-0.0000005} intensity={0.75} angle={0.1} penumbra={1} position={[40, 80, 40]} castShadow/>
                <ambientLight intensity={0.45} />
                <Suspense fallback={null}>
                  <Shoe />
                </Suspense>
                <OrbitControls minPolarAngle={-Math.PI} maxPolarAngle={Math.PI/2} minAzimuthAngle={-Math.PI/7} maxAzimuthAngle={Math.PI/7} />
              </Canvas>
            </div>
          </Col>
          <Col md={4} className="col">
            <div className="content options">
              <h5 className="text-light">Options</h5>
              <Form>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Mur côté</Form.Label>
                  <Form.Control onChange={this.handleSelectMurCote} as="select">
                    <option value="#ffffff">Blanc</option>
                    <option value="#ff0000">Rouge</option>
                    <option value="#00ff00">Vert</option>
                    <option value="#0000ff">Bleu</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect2">
                  <Form.Label>Mur fond</Form.Label>
                  <Form.Control onChange={this.handleSelectMurFond} as="select">
                    <option value="#ffffff">Blanc</option>
                    <option value="#ff0000">Rouge</option>
                    <option value="#00ff00">Vert</option>
                    <option value="#0000ff">Bleu</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check defaultChecked={state.items.Meuble} onChange={this.handleChangeCB} type="checkbox" label="Meubles" />
                </Form.Group>
              </Form>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="col devis">
            <div className="content text-center">
              <h5>Aperçu du devis</h5>
              <Row className="mb-0">
                <Col>
                  <h6>Bardage</h6>
                  <p>10 343,56€</p>
                </Col>
                <Col>
                  <h6>Charpente</h6>
                  <p>10 343,56€</p>
                </Col>
                <Col>
                  <h6>Menuiserie</h6>
                  <p>10 343,56€</p>
                </Col>
              </Row>
              <div className="total">34 343,23€</div>
            </div>
          </Col>
          <Col md={4} className="col conso">
            <div className="content text-center">
              <h5>Aperçu de la consommation</h5>
              <Row>
                <Col md={4}>
                  {this.state.conso && this.state.conso.global && (
                    <div className="percentage">
                      {this.state.conso.global.diffPercentage}
                    </div>
                  )}
                </Col>
                <Col md={8}>
                  <div className="conso-label">
                    d'économie par rapport à un logement de référence.
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ModelConfiguration;
