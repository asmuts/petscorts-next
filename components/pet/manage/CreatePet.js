import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import PetDetailForm from "./PetDetailForm";
import http from "../../../services/authHttpService";
import { toast } from "react-toastify";

export default function CreatePet({ ownerId }) {
  //console.log("CreatePetForm. ownerId " + ownerId);

  const [message, setMessage] = useState("");

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
    //console.log(values);
    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
    const apiURL = `${baseURL}/api/v1/pets`;

    let newPetId;
    try {
      const res = await http.post(apiURL, values);
      if (res.status === 200) {
        //console.log(res.data);
        newPetId = res.data.data._id;
        console.log("Created pet " + newPetId);
        toast("Created a new pet.");
        routeToPetManageForm(newPetId);
      }
    } catch (e) {
      console.log(e, `Error calling ${apiURL}`);
      toast("There was a problem creating a new pet. " + e.message);
      // TODO fix error messaging
      setMessage("Error adding pet. " + e.message);
    }
  };

  return (
    <div>
      <h2>{message}</h2>
      <PetDetailForm
        doSubmit={doSubmit}
        doCancel={doCancel}
        initialValues={initialValues}
      ></PetDetailForm>
    </div>
  );
}
