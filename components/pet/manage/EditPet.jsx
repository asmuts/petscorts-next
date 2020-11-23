//import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Spinner, Row, Col } from "react-bootstrap";
//import { toast } from "react-toastify";

import PetImageSmallCards from "./PetImagesSmallCards";
import PetDetailForm from "./PetDetailForm";
import PetDetailCard from "./PetDetailCard";
//import PetImageResizingForm from "./PetImageResizingForm";
import PetImageCropForm from "./PetImageCropForm";
import { getPet, updatePet } from "../../../services/petService";
import useUserData from "../../../hooks/useUserData";
import { useOwnerForAuth0Sub } from "../../../hooks/useOwnerData";

// Leaflet can't be server side rendered
import dynamic from "next/dynamic";
const MapWithNoSSR = dynamic(() => import("../map/LeafletSingleCircleMap"), {
  ssr: false,
});

// Load the pet data here and not on the page.
// I'll need to update it regularly.
// it's cumbersome to pass a method down more levels
export default function EditPet({ petId, handleError }) {
  console.log("EditPetForm. pet " + petId);

  // TODO make an HOC or something that will handle this common logic
  // Don't even to get any props. SWR will dedupe the calls
  const { user, isLoading: isUserLoading } = useUserData();
  const {
    owner,
    isLoading: isOwnerLoading,
    isError: isOwnerError,
  } = useOwnerForAuth0Sub(user);

  let [pet, setPet] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isPetDataFresh, setIsPetDataFresh] = useState(false);
  // probably just do this in the formik component
  let [initialValues, setInitialValues] = useState({});

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // called by children to ask for a refresh
  const markStale = () => {
    setIsPetDataFresh(false);
  };

  // saves via the service
  const doSubmit = async (values) => {
    const { petId: returnedPetId, err } = await updatePet(petId, values);
    if (!err) {
      markStale();
      toggleEditing();
    } else {
      handleError(err);
    }
  };

  // load the pet
  useEffect(() => {
    //console.log("useEffect");
    async function fetchData() {
      if (petId && !isPetDataFresh) {
        let { pet: foundPet, err } = await getPet(petId);
        //console.log(foundPet);
        if (foundPet) {
          setPet(foundPet);
          setIsPetDataFresh(true);

          // move to form component
          // if the owner is not populated, the value is the id
          initialValues = {
            petId: foundPet._id,
            ownerId: foundPet.owner,
            name: foundPet.name,
            dailyRentalRate: foundPet.dailyRentalRate,
            city: foundPet.city,
            street: foundPet.street,
            state: foundPet.state,
            description: foundPet.description,
            species: foundPet.species,
            breed: foundPet.breed,
          };
          setInitialValues(initialValues);
        }
        if (err) {
          console.log(err.message);
          handleError(err);
          // TODO I need an error component
        }
      }
    }
    fetchData();
  });

  ////////////////////////////////////////////////////////////////////////////

  const renderCard = () => {
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

  if (!pet || isOwnerLoading) {
    return (
      <div>
        <Spinner animation="border" /> Loading...
      </div>
    );
  }

  if (pet && owner) {
    if (pet.ownerId !== owner.ownerId) {
      // TODO make an error component
      return <h3>You are not authorized to edit this pet.</h3>;
    }
  }

  return (
    <>
      {isEditing && renderEditForm()}
      {!isEditing && renderCard()}
      <hr className="mb-2" />
      <PetImageSmallCards
        pet={pet}
        markDataStale={markStale}
      ></PetImageSmallCards>
      <hr className="mb-2" />
      {/* <PetImageResizingForm */}
      <PetImageCropForm
        pet={pet}
        markDataStale={markStale}
        handleError={handleError}
      />
      <hr className="mb-2" />
      Booking blackout edit coming soon.
    </>
  );
}
