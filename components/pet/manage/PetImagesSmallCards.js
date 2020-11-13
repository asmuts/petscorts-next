import http from "../../../services/authHttpService";
import { Card, CardDeck, Button } from "react-bootstrap";
import { toast } from "react-toastify";

function PetImageSmallCards({ pet, markDataStale }) {
  const handleDelete = async (imageId) => {
    //ex. localhost:3001/api/v1/pets/5f8c8f59165a4c1fac20104e/image/5f97128a9741a9345cfdf8b5
    const PET_SEARCH_URI = process.env.NEXT_PUBLIC_API_SERVER_URI;
    const url = `${PET_SEARCH_URI}/api/v1/pets/${pet._id}/image/${imageId}`;
    try {
      const res = await http.delete(url);
      if (res.status === 200) {
        pet = res.data;
        //console.log("Deleted image for pet." + pet);
        toast("Deleted image.");
        markDataStale();
      }
      // TODO handle error
    } catch (e) {
      console.log(e, `Error calling ${url}`);
    }
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
