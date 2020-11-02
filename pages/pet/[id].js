import React from "react";
import axios from "axios";
import { useRouter } from "next/router";

import PetDetailMapBottom from "../../components/pet/pet-detail/PetDetailMapBottom";
import Layout from "../../components/shared/Layout.js";
import { Spinner } from "react-bootstrap";

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
    const res = await axios.get(url);
    if (res.status === 200) {
      pet = res.data;
    } else {
      // TODO handle error
    }
  } catch (e) {
    console.log(e, `Error calling ${url}`);
  }
  return { props: { pet }, revalidate: 10 };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export default Pet;
