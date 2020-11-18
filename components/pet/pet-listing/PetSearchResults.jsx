import { Col, Container, Row } from "react-bootstrap";
import ScrollToTop from "react-scroll-to-top";

import Layout from "../../shared/Layout";
import PetListing from "./PetListing";
import PetSearchMap from "./PetSearchMap";

function PetSearchResults(props) {
  const { pets, message, title } = props;

  const renderPets = (pets, message) => {
    return (
      <div>
        {message !== "" && <h3>{message}</h3>}
        {pets.length === 0 && renderEmptyResults(message)}
        {pets.length > 0 && (
          <Container id="petSearchResults">
            <Row>
              <Col>
                <PetListing pets={pets} />
              </Col>{" "}
              <Col className="d-none d-md-block">
                <PetSearchMap pets={pets} {...props} />
              </Col>{" "}
            </Row>
          </Container>
        )}
      </div>
    );
  };

  const renderEmptyResults = (message) => {
    return (
      <section id="petSearchResults">
        <div style={{ height: "400px", width: "400px" }}>
          <PetSearchMap {...props} />
        </div>
      </section>
    );
  };

  return (
    <Layout>
      <section id="petSearchResults">
        <Row>
          <Col className="col-md-12">
            <p className="page-title">{title}</p>
          </Col>{" "}
        </Row>
        <div>{renderPets(pets, message)}</div>
      </section>
      <ScrollToTop smooth />
    </Layout>
  );
}

export default PetSearchResults;
