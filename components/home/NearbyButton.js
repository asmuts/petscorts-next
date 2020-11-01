import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Container, Button, Spinner } from "react-bootstrap";

const NearbyButton = () => {
  const router = useRouter();

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
    console.log(`Location: ${newLocation.lat},${newLocation.lng}`);
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
    const query = { type: "nearby", lat: location.lat, lng: location.lng };
    const url = { pathname: "/pets", query };
    const asUrl = { pathname: "/pets", query };
    router.push(url, asUrl);
  };

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
        variant="primary"
        className="button_1 rounded-pill"
        dsabled={isLocationLoaded ? "false" : "true"}
      >
        Find nearby
      </Button>
    );
  }

  return renderNearbyButton();
};

export default NearbyButton;
