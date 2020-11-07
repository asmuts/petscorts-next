import React, { Component } from "react";
import PetCard from "./PetCard";

const PetList = ({ pets }) => {
  return <div className="row row-eq-height">{renderPets(pets)}</div>;
};

function renderPets(pets) {
  if (!pets || pets.length === 0) {
    return <p></p>;
  }
  return pets.map((pet) => {
    return <PetCard key={pet._id} colNum="col-md-4 col-xs-6" pet={pet} />;
  });
}

export default PetList;
