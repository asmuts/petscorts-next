import React, { useState } from "react";

import { Carousel } from "react-bootstrap";

export default function PetImageCarousel(props) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const { pet } = props;
  //console.log(pet);
  //w-100
  if (pet.images.length === 0) {
    const src = `/images/${pet.species.toLowerCase()}-clipart.png`;
    pet.images[0] = {
      url: src,
    };
  }

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {pet.images.map((image) => (
        <Carousel.Item key={image.url}>
          <img
            className="bg-white d-block custom-tag"
            src={image.url}
            alt={pet.name}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
