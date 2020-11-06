import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";
import PetSearchResults from "../components/pet/pet-listing/PetSearchResults";

import usePetSearchData from "../hooks/usePetSearchData";

function PetSearch() {
  const router = useRouter();
  const { query } = router;
  //console.log(query);

  const { pets, isLoading, isError } = usePetSearchData(query);

  if (isError) {
    // TODO fix - Make an error component
    return isError.message;
  }

  if (isLoading) {
    return (
      <div>
        <Spinner animation="border" /> Loading...
      </div>
    );
  }

  let message = createMessage(query, pets);
  let title = createTitle(query, pets);
  const { city, state } = getCityAndStateFromQuery(query);

  return (
    <PetSearchResults
      pets={pets}
      message={message}
      title={title}
      city={city}
      state={state}
    ></PetSearchResults>
  );
}

function createTitle(query, pets) {
  let title = "";
  if (pets.length === 0) return title;

  // determine type of serch
  if (query.type === "nearby") {
    title = "Pets near you";
  } else {
    const { city } = getCityAndStateFromQuery(query);
    title = `Pets in ${city} and nearby`;
  }
  return title;
}

function createMessage(query, pets) {
  let message = "";
  const { city } = getCityAndStateFromQuery(query);
  if (pets.length === 0) {
    let cityMessage = "";
    if (city) {
      cityMessage = `in ${city} or`;
    }
    message = `Sorry. There are no pets for rent ${cityMessage} nearby.`;
  }
  return message;
}

function getCityAndStateFromQuery(query) {
  let city = "";
  let state = "";
  if (query.q && query.q !== null && query.q !== "") {
    if (query.q.split(",").length >= 2) {
      city = query.q.split(",")[0];
      state = query.q.split(",")[1].trim();
    }
  }
  if (city) {
    city = city.charAt(0).toUpperCase() + city.slice(1);
  }
  return { city, state };
}

export default PetSearch;
