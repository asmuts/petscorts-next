import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PetDetailForm from "./PetDetailForm";

export default function CreatePet({ ownerId }) {
  console.log("CreatePetForm. ownerId " + ownerId);

  let [initialValues, setInitialValues] = useState({
    ownerId: ownerId,
  });

  const router = useRouter();
  const routeToPetManageForm = (petId) => {
    const query = { petId: petId };
    const url = { pathname: "/pet/managePet", query };
    const asUrl = { pathname: "/pet/managePet", query };
    router.push(url, asUrl);
  };

  const doCancel = async () => {
    router.back();
  };

  const doSubmit = async (values) => {
    console.log(values);
    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
    const apiURL = `${baseURL}/api/v1/pets`;

    let newPetId;
    try {
      const res = await axios.post(apiURL, values);
      if (res.status === 200) {
        newPetId = res.data;

        routeToPetManageForm(newPetId);
      }
    } catch (e) {
      console.log(e, `Error calling ${apiURL}`);
      //TODO handle error
    }
  };

  return (
    <PetDetailForm
      doSubmit={doSubmit}
      doCancel={doCancel}
      initialValues={initialValues}
    ></PetDetailForm>
  );
}