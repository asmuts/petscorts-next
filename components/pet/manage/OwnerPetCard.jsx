import { useRouter } from "next/router";
import { Card, Button } from "react-bootstrap";
import ArchivePetModal from "./ArchivePetModal";
import ReactivatePetButton from "./ReActivatePetButton";
import { renderPetCardImage } from "../../pet/PetCardImage";

// Card to display a pet on the owner manage page
// TODO refactor to a common pet card.
const OwnerPetCard = ({ pet, markStale }) => {
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

  return (
    <Card key={pet._id}>
      <a
        className="pet-detail-link"
        onClick={() => routeToPetDetails(pet._id)}
        href="#"
      >
        {" "}
        <Card.Header className="card-title">{pet.name}</Card.Header>
        {renderPetCardImage(pet)}
        <Card.Body>
          <Card.Text className="card-text">{pet.description}</Card.Text>
          <Card.Text>Species: {pet.species}</Card.Text>
          <Card.Text>Breed: {pet.breed}</Card.Text>
          <Card.Text>Daily Rate: {pet.dailyRentalRate}</Card.Text>
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
        {pet.status === "ARCHIVED" && (
          <ReactivatePetButton
            petId={pet._id}
            informOfChange={markStale}
          ></ReactivatePetButton>
        )}
        {pet.status !== "ARCHIVED" && (
          <ArchivePetModal
            pet={pet}
            informOfChange={markStale}
          ></ArchivePetModal>
        )}
      </Card.Footer>
    </Card>
  );
};

export default OwnerPetCard;
