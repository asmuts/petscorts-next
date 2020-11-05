import { useRouter } from "next/router";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Card, CardDeck, Button } from "react-bootstrap";

const OwnerPetDeck = ({ owner }) => {
  let [pets, setPets] = useState([]);
  let [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!owner || !owner._id) {
      return;
    }
    console.log("useEffect " + owner + " " + isLoading);
    // 3. Get pets for owner.
    async function fetchData() {
      if (isLoading) {
        let foundPets = await getPetsForOwner(owner);
        setPets(foundPets);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [owner]);

  // TODO just populate the owner record from mongo
  // make a new service getPetPopulatedOwner
  async function getPetsForOwner(owner) {
    let foundPets = {};
    if (owner && owner.pets.length === 0) {
      return foundPets;
    }
    console.log("Looking for pets for owner with email [" + owner.email + "]");

    const baseURL = process.env.NEXT_PUBLIC_API_SERVER_URI;
    // TODO, send the list of pet ids instead.
    let apiRoute = `/api/v1/pets-search/owner/${owner._id}`;
    const url = baseURL + apiRoute;
    try {
      const res = await axios.get(url);
      console.log("Pets data: " + res.data);
      if (res.status === 200) {
        foundPets = res.data;
        setPets(foundPets);
      }
    } catch (e) {
      console.log(e, `Error calling ${url}`);
      //TODO handle error
    }
    return foundPets;
  }

  const router = useRouter();
  const routeToPetManageForm = (petId) => {
    const query = { petId: petId };
    push(query, "/pet/managePet");
  };
  const routeToPetDetails = (petId) => {
    push({}, `/pet/${petId}`);
  };
  const push = (query, path) => {
    const url = { pathname: path, query };
    const asUrl = { pathname: path, query };
    router.push(url, asUrl);
  };

  ///////////////////////////////////////////////////////
  if (isLoading) {
    return <p>Loading pets...</p>;
  }

  // console.log("pets.length = " + pets.length);

  if ((!isLoading && pets === null) || !pets.length > 0) {
    //console.log("returning null");
    return <p className="page-title">You don't have any pets listed.</p>;
  }

  function renderImage(pet) {
    if (!pet.images || !pet.images[0]) {
      const src = `/images/${pet.species.toLowerCase()}-clipart.png`;
      return <Card.Img className="card-img-top" src={src}></Card.Img>;
    }
    return (
      <Card.Img
        className="card-img-top"
        src={pet.images[0].url}
        alt={pet.name}
      ></Card.Img>
    );
  }

  const renderCard = (pet, index) => {
    //console.log("renderCard " + pet);
    //console.log("renderCard " + pet._id);

    return (
      <Card className="col-md-3 col-xs-6" key={index}>
        <a
          className="pet-detail-link"
          onClick={() => routeToPetDetails(pet._id)}
          href="#"
        >
          {renderImage(pet)}
          <Card.Body>
            <Card.Title className="card-title">{pet.name}</Card.Title>
            <Card.Text className="card-text">{pet.description}</Card.Text>
          </Card.Body>
        </a>
        <Card.Footer>
          <Button
            variant="primary"
            size="sm"
            onClick={() => routeToPetManageForm(pet._id)}
          >
            Edit
          </Button>
        </Card.Footer>
      </Card>
    );
  };

  return (
    <>
      <>
        <p className="page-title">Your pets.</p>
        <CardDeck>
          {pets.map((pet, index) => {
            return renderCard(pet, index);
          })}
        </CardDeck>
      </>
    </>
  );
};

export default OwnerPetDeck;
