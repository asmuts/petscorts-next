import React, { Component } from "react";
import PetList from "./PetList";

const PetListing = ({ pets }) => {
  return (
    <section id="petListing">
      <PetList pets={pets} />
    </section>
  );
};

export default PetListing;
