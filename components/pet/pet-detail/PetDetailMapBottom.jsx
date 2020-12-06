import React from "react";
import { useRouter } from "next/router";
import { Card } from "react-bootstrap";

import PetImageCarousel from "./PetImageCarousel";
import PetRentalDatePicker from "./PetRentalDatePicker";
import EditPetCardFooter from "./EditPetCardFooter";

// Leaflet can't be server side rendered
import dynamic from "next/dynamic";
const MapWithNoSSR = dynamic(() => import("../map/LeafletSingleCircleMap"), {
  ssr: false,
});

// TODO this is a rough draft. get the pet card out of here
const PetDetailMapBottom = ({ pet }) => {
  const router = useRouter();

  const handleSearchByCity = () => {
    const query = { type: "city_state", q: `${pet.city},${pet.state}` };
    const url = { pathname: "/pets", query };
    const asUrl = { pathname: "/pets", query };
    router.push(url, asUrl);
  };

  // move to a general format method (and I need to format multi word city names)
  if (pet.city) {
    pet.city = pet.city.charAt(0).toUpperCase() + pet.city.slice(1);
  }

  // TODO break up this JSX. It's too big.
  // Some of this should be reusable functions.
  const renderMap = () => {
    if (!pet.location || !pet.location.coordinates) {
      console.log("Pet is lacking geolocation information");
      // TODO reverse geolocate, like I used to do
      // though this shoudln't happen.
      return "";
    }

    return (
      <section id="mapDetails">
        <div className="map-section">
          <div className="row">
            <div className="col-md-12" style={{ height: `500px` }}>
              <MapWithNoSSR
                coordinates={pet.location.coordinates}
              ></MapWithNoSSR>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <section id="petDetailInner">
      <section id="petHeader">
        <div className="title-section">
          <div className="row">
            <div className="col-md-6">
              <p className="page-title">Hi! My name is {pet.name}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6"></div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <a href="#" onClick={handleSearchByCity}>
                <i className="fa fa-search mr-1" aria-hidden="true"></i>{" "}
                {pet.city}, {pet.state}
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6"></div>
          </div>
        </div>
      </section>

      <section id="petDetails">
        <div className="upper-section pet-details">
          <div className="row">
            <div className="col-md-6 col-xs-6">
              {/* <style>
                {`.custom-tag {
                    height: 3500px;
                    background: black;
                    }`}
              </style> */}
              <PetImageCarousel pet={pet} className="custom-tag" />
            </div>
            <div
              className="col-md-6 details-section"
              style={{ height: "375px" }}
            >
              <Card>
                <Card.Header>
                  <Card.Title>{pet.name}</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Card.Text>{pet.description}</Card.Text>
                  <Card.Text>Species: {pet.species}</Card.Text>
                  <Card.Text>Breed: {pet.breed}</Card.Text>
                  <Card.Text hidden>ID: {pet._id}</Card.Text>
                  {pet && pet.owner && (
                    <Card.Text>{pet.owner.fullname}</Card.Text>
                  )}
                </Card.Body>
                <EditPetCardFooter pet={pet}></EditPetCardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="col-md-12">
        <hr className="mt-2 mb-3" />
      </div>

      <section id="calendarDetails">
        <div className="date-section">
          <div className="row">
            <div className="col-md-6">
              <p className="page-title">Availability</p>
            </div>
          </div>
          <div className="row">
            <PetRentalDatePicker pet={pet}></PetRentalDatePicker>
          </div>
        </div>
      </section>

      <hr className="mt-2 mb-3" />

      {renderMap()}
    </section>
  );
};

export default PetDetailMapBottom;
