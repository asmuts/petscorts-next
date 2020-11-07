import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Container, Button, Spinner } from "react-bootstrap";

const NearbyButton = () => {
  const router = useRouter();

  let location;
  let [isLocationLoaded, setLocationLoaded] = useState(false);
  let [isLocationDenied, setLocationDenied] = useState(false);

  const getCurrentPositionFromBrowser = async () => {
    console.log("getCurrentPos");
    await navigator.geolocation.getCurrentPosition(
      updateLocationOnSuccess,
      errorDeniedLocation,
      {}
    );
    return;
  };

  const updateLocationOnSuccess = (position) => {
    const newLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    location = newLocation;
    setLocationLoaded(true);
    console.log(`Location: ${newLocation.lat},${newLocation.lng}`);
    doNearbySearch();
  };

  const doNearbySearch = () => {
    const query = { type: "nearby", lat: location.lat, lng: location.lng };
    const url = { pathname: "/pets", query };
    const asUrl = { pathname: "/pets", query };
    router.push(url, asUrl);
  };

  const errorDeniedLocation = (error) => {
    console.log("Location permission denied");
    if (error.PERMISSION_DENIED) {
      setLocationDenied(true);
    }
  };

  const handleNearbyClick = async () => {
    if (!isLocationLoaded) {
      await getCurrentPositionFromBrowser();
    } else {
      doNearbySearch();
    }
  };

  function renderNearbyButton() {
    if (isLocationDenied) {
      return <p></p>;
    }

    return (
      <Button
        onClick={handleNearbyClick}
        variant="primary"
        className="button_1 rounded-pill"
      >
        Find nearby
      </Button>
    );
  }

  return renderNearbyButton();
};

export default NearbyButton;
