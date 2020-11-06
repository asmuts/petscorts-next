import React from "react";
import Link from "next/link";

function PetCard({ pet }) {
  if (!pet) {
    return <p></p>;
  }
  return (
    <div className="col-md-3 col-xs-6">
      <Link className="pet-detail-link" href={`/pet/${pet._id}`}>
        <div className="card pet-card">
          {renderImage(pet)}
          <div className="card-block">
            <h6 className="card-subtitle">
              {pet.species} {pet.breed} &#183; {pet.city}
            </h6>
            <h4 className="card-title">{pet.name}</h4>
            <p className="card-text">{pet.description}</p>
            <p className="card-text">${pet.dailyRate} per Night &#183;</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

function renderImage(pet) {
  if (!pet.images || !pet.images[0]) {
    const src = `/images/${pet.species.toLowerCase()}-clipart.png`;
    return <img className="card-img-top" src={src}></img>;
  }
  return (
    <img className="card-img-top" src={pet.images[0].url} alt={pet.name}></img>
  );
}

export default PetCard;
