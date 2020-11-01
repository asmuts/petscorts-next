import React from "react";

import PetMap from "./PetMap";
import PetImageCarousel from "./PetImageCarousel";
import PetRentalDatePicker from "./PetRentalDatePicker";
import { Container } from "react-bootstrap";
import { useRouter } from "next/router";
import { Col, Form, Button } from "react-bootstrap";

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
              <h1>{pet.name}</h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6"></div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <a href="#" onClick={handleSearchByCity}>
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
            <div className="col-md-12">
              <style>
                {`.custom-tag {
                    height: 500px;
                    background: black;
                    }`}
              </style>
              <PetImageCarousel pet={pet} className="custom-tag" />
            </div>
          </div>
        </div>

        <hr class="mt-2 mb-3" />

        <div className="details-section">
          <div className="row">
            <div className="col-md-8">
              <h2>ID: {pet._id}</h2>
              <p>{pet.species}</p>
              <p>{pet.description}</p>
              <h1>Owner: {pet.owner.fullname}</h1>
            </div>
            <div className="col-md-4 booking-form rounded">
              <p>{pet.dailyRate || "?"} per day.</p>
              <Form>
                <Form.Row>
                  <Col>
                    <Form.Control placeholder="Start Date" />
                  </Col>
                  <Col>
                    <Form.Control placeholder="End Date" />
                  </Col>
                </Form.Row>

                <Button variant="primary" type="submit">
                  Reserve
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </section>

      <hr class="mt-2 mb-3" />

      <section id="calendarDetails">
        <div className="map-section">
          <div className="row">
            <div className="col-md-12">
              <h2>Availability</h2>
              <PetRentalDatePicker pet={pet}></PetRentalDatePicker>
            </div>
          </div>
        </div>
      </section>

      <hr class="mt-2 mb-3" />

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
