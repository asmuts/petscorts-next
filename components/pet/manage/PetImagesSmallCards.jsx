import { Card, CardDeck, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { deleteImage } from "../../../hooks/petService";

function PetImageSmallCards({ pet, markDataStale }) {
  const handleDelete = async (imageId) => {
    const { pet: returnedPet, image, err } = await deleteImage(
      pet._id,
      imageId
    );
    toast("Deleted image.");
    markDataStale();
  };

  const renderImageCard = (image) => {
    return (
      <Card className="col-md-3 col-xs-6 " key={image.url}>
        <Card.Img
          key={image._id}
          className="card-img-top"
          src={image.url}
          alt={pet.name}
        ></Card.Img>
        <Card.Body> </Card.Body>
        <Card.Footer>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              handleDelete(image._id);
            }}
          >
            Delete
          </Button>
        </Card.Footer>
      </Card>
    );
  };

  return (
    <>
      <p className="page-title">Images</p>
      <div className="row row-eq-height">
        {pet.images.map((image) => {
          return renderImageCard(image);
        })}
      </div>
    </>
  );
}

export default PetImageSmallCards;
