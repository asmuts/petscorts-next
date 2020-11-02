import {
  Card,
  Container,
  Jumbotron,
  Button,
  Navbar,
  Nav,
} from "react-bootstrap";

import Layout from "../components/shared/Layout.js";
import NearbyButton from "./../components/home/NearbyButton";
import Footer from "./../components/shared/Footer";

export default function Home() {
  const bgimage = "/images/background-dogs2-compressed.jpg";

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
        <Footer></Footer>
      </React.Fragment>
    </Layout>
  );
}
