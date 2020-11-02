import React from "react";
import { useRouter } from "next/router";
import { Card, CardDeck, Col, Form, Button } from "react-bootstrap";

import PetMap from "./PetMap";
import PetImageCarousel from "./PetImageCarousel";
import PetRentalDatePicker from "./PetRentalDatePicker";

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
                    height: 500px;
                    background: black;
                    }`}
              </style> */}
              <PetImageCarousel pet={pet} className="custom-tag" />
            </div>
            <div className="col-md-6 details-section">
              <Card>
                <Card.Header>{pet.name}</Card.Header>
                <Card.Body>
                  <Card.Text>{pet.description}</Card.Text>
                  <Card.Text>Species: {pet.species}</Card.Text>
                  <Card.Text>Breed: {pet.breed}</Card.Text>
                  <Card.Text hidden>ID: {pet._id}</Card.Text>
                  <Card.Text>Owner: {pet.owner.fullname}</Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
        {/* <hr class="mt-2 mb-3" /><div className="details-section">
          <div className="row">
            <div className="col-md-8 details-section">
              <Card>
                <Card.Header>{pet.name}</Card.Header>
                <Card.Body>
                  <Card.Text>{pet.description}</Card.Text>
                  <Card.Text>Species: {pet.species}</Card.Text>
                  <Card.Text>Breed: {pet.breed}</Card.Text>
                  <Card.Text hidden>ID: {pet._id}</Card.Text>
                  <Card.Text>Owner: {pet.owner.fullname}</Card.Text>
                </Card.Body>
              </Card>
            </div>

            <div className="col-md-3"></div>
          </div>
        </div>
 */}{" "}
      </section>

      <div className="col-md-12">
        <hr className="mt-2 mb-3" />
      </div>

      <section id="calendarDetails">
        <div className="date-section">
          <div className="row">
            <p className="page-title">Availability</p>
          </div>
          <PetRentalDatePicker pet={pet}></PetRentalDatePicker>
        </div>
      </section>

      <hr className="mt-2 mb-3" />

      <section id="mapDetails">
        <div className="map-section">
          <div className="row">
            <div className="col-md-12">
              <PetMap
                location={`${pet.street},${pet.city},${pet.state}`}
                height="500"
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default PetDetailMapBottom;
