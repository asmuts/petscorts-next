import React from "react";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";

import { getPet } from "../../hooks/petService";
import Layout from "../../components/shared/Layout";
import PetDetailMapBottom from "../../components/pet/pet-detail/PetDetailMapBottom";

function Pet({ pet }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div>
        <Spinner animation="border" /> Loading...
      </div>
    );
  }

  return (
    <Layout>
      <section id="petDetail">
        <PetDetailMapBottom pet={pet} />
      </section>
    </Layout>
  );
}

// Static page generation with a refresh interval
export async function getStaticProps({ params }) {
  if (params.id) {
    console.log(params.id);
  }
  let { pet, err } = await getPet(params.id);

  // for some reason it doesn't work with a config value
  // TODO look into this further
  //const revalidateSetting = process.env.REVALIDATE_PET;
  //return { props: { pet }, revalidate: revalidateSetting };
  return { props: { pet }, revalidate: 30 };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export default Pet;
