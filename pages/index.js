import { Card, Container, Jumbotron, Button } from "react-bootstrap";

import Layout from "../components/shared/Layout.js";
import NearbyButton from "./../components/home/NearbyButton";

export default function Home() {
  const bgimage = "/images/background-dogs1.png";

  return (
    <Layout>
      <React.Fragment>
        <div className="container-full-bg">
          <Jumbotron
            className="jumbotron-main"
            fluid
            style={{
              backgroundImage: `url(${bgimage})`,
              backgroundSize: "cover",
              height: "50vh",
            }}
          >
            <Container className="container-overlay">
              <div className="welcome">Welcome to Petscorts!</div>
              <div className="buttons_div">
                <NearbyButton></NearbyButton>
              </div>
            </Container>
          </Jumbotron>
        </div>{" "}
        <Card className="text-center">
          <Card.Header>Featured Pets</Card.Header>
          <Card.Body>
            <Card.Title>Special title treatment</Card.Title>
            <Card.Text>
              With supporting text below as a natural lead-in to additional
              content.
            </Card.Text>
            <Button variant="outline-primary rounded-pill">Go somewhere</Button>
          </Card.Body>
          <Card.Footer className="text-muted"></Card.Footer>
        </Card>{" "}
      </React.Fragment>
    </Layout>
  );
}
