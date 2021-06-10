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
  current: any,
  items: any
} 

// Using a Valtio state model to bridge reactivity between
// the canvas and the dom, both can write to it and/or react to it.
const objectTest : test = {
  current: null,
  items: {
    laces: "#ffffff",
    mesh: "#ffffff",
    caps: "#ffffff",
    inner: "#ffffff",
    sole: "#ffffff",
    stripes: "#ffffff",
    band: "#ffffff",
    patch: "#ffffff",
  },
}

const state = proxy(objectTest);

function Shoe() {
  const ref = useRef()
  const snap = useProxy(state)
  // Drei's useGLTF hook sets up draco automatically, that's how it differs from useLoader(GLTFLoader, url)
  // { nodes, materials } are extras that come from useLoader, these do not exist in threejs/GLTFLoader
  // nodes is a named collection of meshes, materials a named collection of materials
  const { nodes, materials } = useGLTF("Test.glb") as any

  console.log("nodes", nodes);
  console.log("-------------------------");
  console.log("materials", materials);
  console.log("-------------------------");
  console.log("Cylinder010", (nodes.Cylinder010 as any).geometry);
  console.log("MurCote", (nodes.MurCote as any).geometry);
  // Animate model
  //useFrame((state) => {
  //  const t = state.clock.getElapsedTime();
//
  //  (ref as any).current.rotation.z = -0.2 - (1 + Math.sin(t / 1.5)) / 20;
  //  (ref as any).current.rotation.x = Math.cos(t / 4) / 8;
  //  (ref as any).current.rotation.y = Math.sin(t / 4) / 8;
  //  (ref as any).current.position.y = (1 + Math.sin(t / 1.5)) / 10;
  //})

  // Using the GLTFJSX output here to wire in app-state and hook up events
  return (
    <group
      ref={ref}
      dispose={null}>
      <mesh ref={(nodes.MurCote as any)} />
      <mesh ref={(nodes.MurFond as any)} />
      <mesh ref={(nodes.Sol as any)} />
      <mesh geometry={(nodes.Cylinder010 as any).geometry} material={(nodes.Cylinder010 as any).material} />
      <mesh geometry={(nodes.Cylinder010_1 as any).geometry} material={(nodes.Cylinder010_1 as any).material} />
      <mesh geometry={(nodes.Cylinder010_2 as any).geometry} material={(nodes.Cylinder010_2 as any).material} />
      <mesh geometry={(nodes.Cylinder010_3 as any).geometry} material={(nodes.Cylinder010_3 as any).material} />
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
              <Canvas className="Canva" camera={{ position: [0, 0, 10] }}>
                <ambientLight intensity={0.3} />
                <spotLight intensity={0.3} angle={0.1} penumbra={1} position={[5, 25, 20]} />
                <Suspense fallback={null}>
                  <Shoe />
                  <ContactShadows rotation-x={Math.PI / 2} position={[0, -0.8, 0]} opacity={0.25} width={10} height={10} blur={2} far={1} />
                </Suspense>
                <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} enableZoom={false} enablePan={false} />
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
