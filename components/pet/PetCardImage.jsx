import { Card } from "react-bootstrap";

export function renderPetCardImage(pet) {
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
