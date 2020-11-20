import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Form, CardDeck, Button } from "react-bootstrap";
import OwnerPetCard from "./OwnerPetCard";
import useUserData from "../../../hooks/useUserData";
import { useOwnerForAuth0Sub } from "../../../hooks/useOwnerData";

// Shows the owners pets. By default, archived pets are hidden from view.
const OwnerPetDeck = () => {
  let [showArchived, setShowArchived] = useState(false);

  // Don't even to get any props. SWR will dedupe the calls
  const { user, isLoading: isUserLoading } = useUserData();
  const {
    owner,
    mutate,
    isLoading: isLoading,
    isError: isError,
  } = useOwnerForAuth0Sub(user);

  const markStale = () => {
    mutate();
  };

  ///////////////////////////////////////////////////////
  if (isLoading) {
    return <p>Loading pets...</p>;
  }

  if (isError) {
    // TODO make an error page
    return <h1>Couldn't load your pets at this time.</h1>;
  }

  if ((!isLoading && owner.pets === null) || !owner.pets.length > 0) {
    return <p className="page-title">You don't have any pets listed.</p>;
  }

  const renderCard = (pet, index) => {
    return (
      <div className="col-md-4 col-xs-6" key={pet._id}>
        <OwnerPetCard
          pet={pet}
          markStale={markStale}
          key={pet._id}
        ></OwnerPetCard>
      </div>
    );
  };

  return (
    <>
      <p className="page-title">Your pets.</p>
      <Form.Check
        label="Show Archived"
        value={showArchived}
        onClick={() => setShowArchived(!showArchived)}
      />
      <CardDeck>
        {owner.pets.map((pet, index) => {
          if (!showArchived && pet.status === "ARCHIVED") {
            return;
          } else {
            return renderCard(pet, index);
          }
        })}
      </CardDeck>
    </>
  );
};

export default OwnerPetDeck;
