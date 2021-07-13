import home_devis from "../../assets/images/home-devis.png";
import home_3D from "../../assets/images/home-3D.png";
import home_conso from "../../assets/images/home-conso.png";
import home_video from "../../assets/images/home-video.mp4";
import "./home.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faEnvelopeOpenText,
  faInfoCircle,
  faLaptopHouse,
  faPhone,
  faFileContract,
  faEnvelope,
  faQuestionCircle,
  faBriefcase,
  faNewspaper,
  faUserShield,
  faHome,
  faMailBulk,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "react-bootstrap";
import ScrollAnimation from "react-animate-on-scroll";

function Home() {
  return (
    <main>
      <ScrollAnimation animateIn="fadeIn">
        <div className="cover-container d-flex p-3 mx-auto flex-column">
          <video autoPlay muted loop src={home_video} />
          <div className="overlay"></div>
          <div className="cover-container-content">
            <h1 className="text-green text-center title">
              <FontAwesomeIcon icon={faLaptopHouse} size="lg" /> <br />
              <strong>L'outil pour configurer</strong>
              <br />
              votre espace modulaire
            </h1>
            <h5 className="w-75 text-justify mx-auto mt-5 text-green">
              Grâce à l'outil ConfigUrHouse proposé par la société Deschamps, vous pouvez configurer directement votre logement selon vos goûts afin d'obtenir un devis détaillé des options choisies et une estimation de la consommation énergétique de votre futur logement.
            </h5>
            <div className="row justify-content-center m-0 mt-5">
              <div className="col-md-3 mt-2">
              <Link to="/config"><div className="btn w-100 btn-green"> <FontAwesomeIcon icon={faHome} /> Je configure mon logement</div></Link>
              </div>
              <div className="col-md-3 mt-2">
              <Link to="/contact"><div className="btn btn-out w-100"><FontAwesomeIcon icon={faMailBulk} /> Nous contacter</div></Link>
              </div>
            </div>
          </div>
        </div>
        <svg
          version="1.1"
          xmlns="https://www.w3.org/2000/svg"
          className="wave rotate"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            d="M826.337463,25.5396311 C670.970254,58.655965 603.696181,68.7870267 447.802481,35.1443383 C293.342778,1.81111414 137.33377,1.81111414 0,1.81111414 L0,150 L1920,150 L1920,1.81111414 C1739.53523,-16.6853983 1679.86404,73.1607868 1389.7826,37.4859505 C1099.70117,1.81111414 981.704672,-7.57670281 826.337463,25.5396311 Z"
            fill="#a8cfcf"
          ></path>
        </svg>
      </ScrollAnimation>
      <ScrollAnimation animateIn="fadeIn">
        <Row className="justify-content-md-center m-0 mt-5 mb-5">
          <Col md={4}>
            <h2 className="font-weight-bold mt-3">
              Visualiser en direct vos configurations en 3D
            </h2>
            <p>
              A l'aide du configurateur vous pouvez visualiser directement les options choisies pour votre logement selon vos goûts.
            </p>
          </Col>
          <Col md={5}>
            <img src={home_3D} alt="Home config" className="w-100" />
          </Col>
        </Row>
      </ScrollAnimation>
      <ScrollAnimation animateIn="fadeIn">
        <svg
          version="1.1"
          xmlns="https://www.w3.org/2000/svg"
          className="wave mt-5"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            d="M826.337463,25.5396311 C670.970254,58.655965 603.696181,68.7870267 447.802481,35.1443383 C293.342778,1.81111414 137.33377,1.81111414 0,1.81111414 L0,150 L1920,150 L1920,1.81111414 C1739.53523,-16.6853983 1679.86404,73.1607868 1389.7826,37.4859505 C1099.70117,1.81111414 981.704672,-7.57670281 826.337463,25.5396311 Z"
            fill="#a8cfcf"
          ></path>
        </svg>
        <Row className="justify-content-md-center m-0 pt-5 pb-5 bg-lightgreen">
          <Col md={4}>
            <img src={home_devis} alt="Home Devis" className="w-100" />
          </Col>
          <Col md={4}>
            <h2 className="font-weight-bold mt-3">
              Obtenez votre devis détaillé instantanément
            </h2>
            <p>
              Une fois votre logement configuré selon vos goûts, vous pouvez obtenir un devis détaillé des options choisies.
            </p>
          </Col>
        </Row>
        <svg
          version="1.1"
          xmlns="https://www.w3.org/2000/svg"
          className="wave rotate"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            d="M826.337463,25.5396311 C670.970254,58.655965 603.696181,68.7870267 447.802481,35.1443383 C293.342778,1.81111414 137.33377,1.81111414 0,1.81111414 L0,150 L1920,150 L1920,1.81111414 C1739.53523,-16.6853983 1679.86404,73.1607868 1389.7826,37.4859505 C1099.70117,1.81111414 981.704672,-7.57670281 826.337463,25.5396311 Z"
            fill="#a8cfcf"
          ></path>
        </svg>
      </ScrollAnimation>
      <ScrollAnimation animateIn="fadeIn">
        <Row className="justify-content-md-center m-0 mt-5 mb-5">
          <Col md={5}>
            <img src={home_conso} alt="Home conso" className="w-100" />
          </Col>
          <Col md={4}>
            <h2 className="font-weight-bold mt-3">
              Prévisualiser les consommations de votre futur logement
            </h2>
            <p>
              Vous pouvez aussi obtenir une consommation énergétique estimée selon les options choisies à la fin de votre configuration.
            </p>
          </Col>
        </Row>
      </ScrollAnimation>
      <div className="footer bg-lightgreen p-5">
        <Row className="justify-content-md-center text-green text-center m-0">
          <Col>
            <h4>
              <FontAwesomeIcon icon={faEnvelopeOpenText} /> Nous contacter
            </h4>
            <ul className="mt-3 p-0">
              <hr />
              <li>
                <FontAwesomeIcon icon={faEnvelope} /> contact@deschampignons.fr
              </li>
              <li>
                <FontAwesomeIcon icon={faPhone} /> 06 53 12 21 34
              </li>
            </ul>
          </Col>
          <Col>
            <h4>
              <FontAwesomeIcon icon={faBuilding} /> L'entreprise
            </h4>
            <ul className="mt-3 p-0">
              <hr />
              <li>
                <FontAwesomeIcon icon={faQuestionCircle} /> Qui sommes-nous ?
              </li>
              <li>
                <FontAwesomeIcon icon={faBriefcase} /> Emplois
              </li>
              <li>
                <FontAwesomeIcon icon={faNewspaper} /> Actualités
              </li>
            </ul>
          </Col>
          <Col>
            <h4>
              <FontAwesomeIcon icon={faInfoCircle} /> Informations
            </h4>
            <ul className="mt-3 p-0">
              <hr />
              <Link to="/mentions">
                <li>
                  <FontAwesomeIcon icon={faFileContract} /> Mentions légales
                </li>
              </Link>
              <Link to="/policies">
                <li>
                  <FontAwesomeIcon icon={faUserShield} /> Politique de
                  confidentialité
                </li>
              </Link>
            </ul>
          </Col>
        </Row>
      </div>
    </main>
  );
}

export default Home;
