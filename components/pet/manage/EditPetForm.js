import axios from "axios";
import React, { useState, useEffect } from "react";
import { Card, Spinner, Button } from "react-bootstrap";
import PetImageSmallCards from "./PetImagesSmallCards";
import PetDetailForm from "./PetDetailForm";
import PetImageForm from "./PetImageForm";

// TODO load the pet data here and not on the page.
// I'll need to update it regularly.
// it's cumbersome to pass a method down more levels
export default function EditPetForm({ petId }) {
  console.log("EditPetForm. pet " + petId);

  let [pet, setPet] = useState();
  // display a details card and have an edit button
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const [isPetDataFresh, setIsPetDataFresh] = useState(false);
  const markStale = () => {
    console.log("markStale");
    setIsPetDataFresh(false);
  };

  // probably just do this in the formik component
  let [initialValues, setInitialValues] = useState({});

  const doSubmit = async (values) => {
    console.log(values);
    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
    const apiURL = `${baseURL}/api/v1/pets/${petId}`;
    try {
      const res = await axios.put(apiURL, values);
      const petId = res.data;
      // lets get the data from the db
      markStale();
      toggleEditing();
    } catch (e) {
      console.log(e, `Error calling ${apiURL}`);
      //TODO handle error
    }
  };

  // load the pet
  useEffect(() => {
    async function fetchData() {
      console.log("fetch Data");
      if (petId && !isPetDataFresh) {
        console.log("Data is stale " + petId);

        const PET_SEARCH_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
        const url = `${PET_SEARCH_URI}/api/v1/pets-search/${petId}`;
        try {
          const res = await axios.get(url);
          if (res.status === 200) {
            pet = res.data;
            console.log("Retrieved pet.");
          }
        } catch (e) {
          console.log(e, `Error calling ${url}`);
        }
        setPet(pet);
        setIsPetDataFresh(true);

        initialValues = {
          petId: pet._id,
          ownerId: pet.owner._id,
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
    }
    fetchData();
  });

  /////////////////////////////////////////////////////////

  // TODO move to a component.  Should consolidate with deatil page
  const renderCard = (pet) => {
    console.log("renderCard " + pet);
    console.log("renderCard " + pet._id);

    return (
      <Card>
        <Card.Header className="page-title">{pet.name}</Card.Header>
        <Card.Body>
          <Card.Text>Description: {pet.description}</Card.Text>
          <Card.Text>Species: {pet.species}</Card.Text>
          <Card.Text>Breed: {pet.breed}</Card.Text>
          <Card.Text>Daily Rate: {pet.dailyRentalRate}</Card.Text>
          <Card.Text hidden>ID: {pet._id}</Card.Text>
          <Card.Text>Owner: {pet.owner.fullname}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button
            variant="primary"
            size="sm"
            className="rounded"
            onClick={toggleEditing}
          >
            Edit
          </Button>
        </Card.Footer>
      </Card>
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

  //console.log("isEditing " + isEditing);
  return (
    <>
      {isEditing && renderEditForm()}
      {!isEditing && renderCard(pet)}
      <hr mb-2 />
      <PetImageSmallCards
        pet={pet}
        markDataStale={markStale}
      ></PetImageSmallCards>
      <hr mb-2 />
      <PetImageForm pet={pet} markDataStale={markStale} />
      <hr mb-2 />
      Booking blackout edit coming soon.
    </>
  );
}
