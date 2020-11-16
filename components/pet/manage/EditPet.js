//import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Spinner, Row, Col } from "react-bootstrap";
//import { toast } from "react-toastify";

import PetImageSmallCards from "./PetImagesSmallCards";
import PetDetailForm from "./PetDetailForm";
import PetDetailCard from "./PetDetailCard";
import PetImageResizingForm from "./PetImageResizingForm";
import { getPet, updatePet } from "../../../hooks/petService";

// Leaflet can't be server side rendered
import dynamic from "next/dynamic";
const MapWithNoSSR = dynamic(() => import("../map/LeafletSingleCircleMap"), {
  ssr: false,
});

// TODO! verify that the user is the owner
// this would be easy if I put the owner email in the pet record

// Load the pet data here and not on the page.
// I'll need to update it regularly.
// it's cumbersome to pass a method down more levels
export default function EditPet({ petId, user }) {
  //console.log("EditPetForm. pet " + petId);

  let [pet, setPet] = useState();
  // display a details card and have an edit button
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // called by children to ask for a refresh
  const [isPetDataFresh, setIsPetDataFresh] = useState(false);
  const markStale = () => {
    setIsPetDataFresh(false);
  };

  // probably just do this in the formik component
  let [initialValues, setInitialValues] = useState({});

  // saves via the service
  const doSubmit = async (values) => {
    const { petId, err } = updatePet(petId, values);
    if (!err) {
      markStale();
      toggleEditing();
    } else {
      // TODO error messaging
    }
  };

  // load the pet
  useEffect(() => {
    async function fetchData() {
      if (petId && !isPetDataFresh) {
        let { pet: foundPet, err } = getPet(petId);
        if (foundPet) {
          setPet(foundPet);
          setIsPetDataFresh(true);

          // move to form component
          // if the owner is not populated, the value is the id
          initialValues = {
            petId: pet._id,
            ownerId: pet.owner,
            name: pet.name,
            dailyRentalRate: pet.dailyRentalRate,
            city: pet.city,
            street: pet.street,
            state: pet.state,
            description: pet.description,
            species: pet.species,
            breed: pet.breed,
          };
          setInitialValues(initialValues);
        }
        if (err) {
          // TODO I need an error component
        }
      }
    }
    fetchData();
  });

  ////////////////////////////////////////////////////////////////////////////

  const renderCard = (pet) => {
    return (
      <Row>
        <Col md="6">
          <PetDetailCard
            pet={pet}
            toggleEditing={toggleEditing}
          ></PetDetailCard>
        </Col>
        <Col md="6">
          <MapWithNoSSR coordinates={pet.location.coordinates}></MapWithNoSSR>
        </Col>
      </Row>
    );
  };

  const renderEditForm = () => {
    return (
      <>
        <p className="page-title">Edit Pet Details</p>
        <PetDetailForm
          doSubmit={doSubmit}
          doCancel={toggleEditing}
          initialValues={initialValues}
        ></PetDetailForm>
      </>
    );
  };

  if (!pet) {
    return (
      <div>
        <Spinner animation="border" /> Loading...
      </div>
    );
  }

  return (
    <>
      {isEditing && renderEditForm()}
      {!isEditing && renderCard(pet)}
      <hr className="mb-2" />
      <PetImageSmallCards
        pet={pet}
        markDataStale={markStale}
      ></PetImageSmallCards>
      <hr className="mb-2" />
      <PetImageResizingForm pet={pet} markDataStale={markStale} />
      <hr className="mb-2" />
      Booking blackout edit coming soon.
    </>
  );
}
