import axios from "axios";
import PetDetailForm from "./PetDetailForm";
import React, { useState, useEffect } from "react";

export default function CreatePetForm({ ownerId }) {
  console.log("CreatePetForm. ownerId " + ownerId);

  let [initialValues, setInitialValues] = useState({
    ownerId: ownerId,
  });

  const doSubmit = async (values) => {
    console.log(values);
    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
    const apiURL = `${baseURL}/api/v1/pets`;

    let newPetId;
    try {
      const res = await axios.post(apiURL, values);
      console.log("data: " + res.data);
      newPetId = res.data;

      //populate (might want to go to the db or let the form do this if there is a petId)
      initialValues = {
        petId: newPetId,
        ownerId: ownerId,
        name: values.name,
        dailyRentalRate: values.dailyRentalRate,
        city: values.city,
        state: values.state,
        descriptions: values.description,
        species: values.species,
        breed: values.breed,
      };
    } catch (e) {
      console.log(e, `Error calling ${apiURL}`);
      //TODO handle error
    }
  };

  return (
    <PetDetailForm
      doSubmit={doSubmit}
      initialValues={initialValues}
    ></PetDetailForm>
  );
}
