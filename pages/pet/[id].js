import React from "react";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";
import http from "../../services/httpService";

import Layout from "../../components/shared/Layout.js";
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

export async function getStaticProps({ params }) {
  let pet = {};
  if (params.id) {
    console.log(params.id);
  }
  const PET_SEARCH_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
  const url = `${PET_SEARCH_URI}/api/v1/pets-search/${params.id}`;
  try {
    const res = await http.get(url);
    if (res.status === 200) {
      pet = res.data.data;
      console.log(pet);
    } else {
      // TODO handle error
    }
  } catch (e) {
    console.log(e, `Error calling ${url}`);
  }
  // for some reason it doesn't work with a config value
  // TODO look into this further
  const revalidateSetting = process.env.REVALIDATE_PET;
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
