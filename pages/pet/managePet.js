import { useRouter } from "next/router";
import React from "react";
import { Container } from "react-bootstrap";
import ScrollToTop from "react-scroll-to-top";

import Layout from "../../components/shared/Layout.js";
import CreatePet from "../../components/pet/manage/CreatePet";
import EditPet from "../../components/pet/manage/EditPet";
import { useFetchUser } from "../../util/user";

function ManagePet() {
  const { user, loading } = useFetchUser();
  const router = useRouter();

  // Not authorized. TODO message user
  if ((!user && !loading) || (user === null && !loading)) {
    return router.replace("/api/auth/login");
  }

  // get pet if an id is supplied
  // otherwise it's an add pet
  const query = router.query;
  let petId = query.petId;
  let ownerId = query.ownerId;

  return (
    <Layout>
      <section id="petDetail">
        <Container fluid className="main-container">
          {ownerId && <CreatePet ownerId={ownerId}></CreatePet>}
          {petId && <EditPet petId={petId} user={user}></EditPet>}
        </Container>
      </section>
      <ScrollToTop smooth />
    </Layout>
  );
}

export default ManagePet;
