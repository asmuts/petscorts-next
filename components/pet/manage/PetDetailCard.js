import React from "react";
import { Card, Button } from "react-bootstrap";

const PetDetailCard = ({ pet, toggleEditing }) => {
  return (
    <Card>
      <Card.Header className="page-title">{pet.name}</Card.Header>
      <Card.Body>
        <Card.Text>Description: {pet.description}</Card.Text>
        <Card.Text>Species: {pet.species}</Card.Text>
        <Card.Text>Breed: {pet.breed}</Card.Text>
        <Card.Text>Daily Rate: {pet.dailyRentalRate}</Card.Text>
        <Card.Text hidden>ID: {pet._id}</Card.Text>
        {pet.owner && <Card.Text>Owner: {pet.owner.fullname}</Card.Text>}
      </Card.Body>
      <Card.Footer>
        <Button
          variant="primary"
          size="sm"
          className="rounded"
          onClick={toggleEditing}
        >
          Edit
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default PetDetailCard;
