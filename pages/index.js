import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import Header from "../components/shared/Header";

import { Card, Container, Jumbotron, Button, Spinner } from "react-bootstrap";

export default function Home() {
  const router = useRouter();

  // Move all this to a Buttom Component
  let [location, setLocation] = useState({});
  let [isLocationLoaded, setLocationLoaded] = useState(false);
  let [isLocationDenied, setLocationDenied] = useState(false);

  const getCurrentPositionFromBrowser = async () => {
    navigator.geolocation.getCurrentPosition(
      updateLocationOnSuccess,
      errorDeniedLocation,
      {}
    );
  };

  const updateLocationOnSuccess = (position) => {
    const newLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setLocation(newLocation);
    setLocationLoaded(true);
    console.log("Location = " + newLocation);
  };

  const errorDeniedLocation = (error) => {
    console.log("Location permission denied");
    if (error.PERMISSION_DENIED) {
      setLocationDenied(true);
    }
  };

  useEffect(() => {
    getCurrentPositionFromBrowser();
  }, []);

  const handleNearbyClick = () => {
    router.push({
      pathname: "/pet-search-results",
      query: { type: "nearby", lat: location.lat, lng: location.lng },
    });
  };

  const bgimage = "/images/background-dogs1.png";

  function renderNearbyButton() {
    if (isLocationDenied) {
      return <p></p>;
    }

    // IE handles disabled differently.  disable=true doesn't work!
    if (!isLocationLoaded) {
      return (
        <Button
          onClick={isLocationLoaded ? handleNearbyClick : null}
          variant="outline-primary"
          className="button_1 rounded-pill"
          disabled
        >
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Find nearby
        </Button>
      );
    }

    return (
      <Button
        onClick={isLocationLoaded ? handleNearbyClick : null}
        variant="outline-primary"
        className="button_1 rounded-pill"
        dsabled={isLocationLoaded ? "false" : "true"}
      >
        Find nearby
      </Button>
    );
  }

  return (
    <React.Fragment>
      <Header> </Header>
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
          <Container>
            <div className="welcome">Welcome to Petscorts!</div>
            <div className="buttons_div">{renderNearbyButton()}</div>
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
          <Button variant="primary rounded-pill">Go somewhere</Button>
        </Card.Body>
        <Card.Footer className="text-muted"></Card.Footer>
      </Card>{" "}
    </React.Fragment>
  );
}

{
}
