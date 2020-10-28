import React, { Component } from "react";
import PetCard from "./PetCard";

const PetList = ({ pets }) => {
  return <div className="row row-eq-height">{renderPets(pets)}</div>;
};

function renderPets(pets) {
  let count = 0;
  return pets.map((pet, index) => {
    return <PetCard key={count++} colNum="col-md-3 col-xs-6" pet={pet} />;
  });
}

export default PetList;
