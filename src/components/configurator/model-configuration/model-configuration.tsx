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

interface test {
  items: any
} 

const objectTest : test = {
  items: {
    MurCote: "#ffffff",
    MurFond: "#ffffff",
    Sol: "#ffffff",
  },
}

const state = proxy(objectTest);

function Shoe() {
  const ref = useRef()
  const snap = useProxy(state)

  const { nodes, materials } = useGLTF("Test8.glb") as any

  console.log("nodes", nodes);
  console.log("-------------------------");
  console.log("materials", materials);
  console.log("-------------------------");
  console.log("Cylinder010", (nodes.Cylinder010 as any).geometry);
  console.log("MurCote", (nodes.MurCote as any).geometry);

  return (
    <group
      ref={ref}
      castShadow
      receiveShadow
      dispose={null}>
      <mesh castShadow receiveShadow geometry={(nodes.MurCote as any).geometry} material={(nodes.MurCote as any).material}  material-color="#2b768f"/>
      <mesh castShadow receiveShadow geometry={(nodes.MurFond as any).geometry} material={(nodes.MurFond as any).material} material-color="#003f54"/>
      <mesh castShadow receiveShadow geometry={(nodes.Sol as any).geometry} material={(nodes.Sol as any).material}/>
      <mesh castShadow receiveShadow geometry={(nodes.Cylinder010 as any).geometry} material={(nodes.Cylinder010 as any).material} />
      <mesh castShadow receiveShadow geometry={(nodes.Cylinder010_1 as any).geometry} material={(nodes.Cylinder010_1 as any).material} />
      <mesh castShadow receiveShadow geometry={(nodes.Cylinder010_2 as any).geometry} material={(nodes.Cylinder010_2 as any).material} />
      <mesh castShadow receiveShadow geometry={(nodes.Cylinder010_3 as any).geometry} material={(nodes.Cylinder010_3 as any).material} />
    </group>
  )
}


class ModelConfiguration extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={8} className="col">
            <div className="content CanvaContainer">
              <h5>Visualisation du modèle {this.props.model.name}</h5>
              <Canvas shadows className="Canva" camera={{ position: [0, 8, 8], fov: 60  }}>
                <spotLight shadow-mapSize-width={5120} shadow-mapSize-height={5120} shadowBias={-0.0000005} intensity={0.75} angle={0.1} penumbra={1} position={[40, 80, 40]} castShadow/>
                <ambientLight intensity={0.45} />
                <Suspense fallback={null}>
                  <Shoe />
                </Suspense>
                <OrbitControls />
              </Canvas>
            </div>
          </Col>
          <Col md={4} className="col">
            <div className="content options">
              <h5 className="text-light">Options</h5>
              <Form>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    <option>Parquet Flottant</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    <option>Bardage bois</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    <option>Ossature métale</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    <option>Meublé</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    <option>Papier peint noir</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    <option>Pas de terrasse</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select">
                    <option>Isolation passive</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
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
            <div className="content">
              <Row>
                <Col md={7}>
                  <h5>Aperçu de la consommation</h5>
                  <p>
                    Comparer la consommation de ce logement par rapport à
                    des logements de références.
                  </p>
                </Col>
                <Col md={5}></Col>
              </Row>
            </div>
          </Col>

        </Row>
      </div>
    );
  }
}

export default ModelConfiguration;
