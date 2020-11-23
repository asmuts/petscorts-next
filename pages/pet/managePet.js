import { useRouter } from "next/router";
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import ScrollToTop from "react-scroll-to-top";
import { toast } from "react-toastify";

import Layout from "../../components/shared/Layout";
import CreatePet from "../../components/pet/manage/CreatePet";
import EditPet from "../../components/pet/manage/EditPet";
import { useFetchUser } from "../../util/user";
//import useUserData from "../hooks/useUserData";

function ManagePet() {
  //const { user, isLoading: loading } = useUserData();
  const { user, loading } = useFetchUser();
  const router = useRouter();

  let [mustReAuthenticate, setMustReAuthenticate] = useState(false);
  let [error, setError] = useState();

  /////////////////////////////////////////////////////////////////////
  // if ((!user && !isUserLoading) || isUserError || mustReAuthenticate) {
  if (
    (!user && !loading) ||
    (user === null && !loading) ||
    mustReAuthenticate
  ) {
    router.replace("/api/auth/login");
    // return something, else a nothing returned from render error will splash
    return "";
  }

  // Not authorized. TODO message user
  if ((!user && !loading) || (user === null && !loading)) {
    return router.replace("/api/auth/login");
  }

  // get pet if an id is supplied
  // otherwise it's an add pet
  const query = router.query;
  let petId = query.petId;
  let ownerId = query.ownerId;

  function handleError(err) {
    console.log("Profile. handleError: " + err);
    console.log(err);
    if ((err + "").includes("404")) {
      // ignore, the user hasn't booked or listed any pets
      return;
    }
    if ((err + "").includes("AccessTokenError") || (err + "").includes("401")) {
      // TODOimplement
      setMustReAuthenticate(true);
    }
    setError(err);
    toast(err);
  }

  return (
    <Layout>
      <section id="petDetail">
        <Container fluid className="main-container">
          {ownerId && (
            <CreatePet ownerId={ownerId} handleError={handleError}></CreatePet>
          )}
          {petId && <EditPet petId={petId} handleError={handleError}></EditPet>}
        </Container>
      </section>
      <ScrollToTop smooth />
    </Layout>
  );
}

export default ManagePet;
