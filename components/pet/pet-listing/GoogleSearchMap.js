import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Circle,
  InfoWindow,
} from "react-google-maps";

function GoogleSearchMap(props) {
  const { pets, cityData } = props;

  if (pets.length === 0) {
    return renderEmptyMap(cityData);
  }

  if (pets && pets.length > 0) {
    return renderPopulatedMap(pets, cityData);
  }

  return <h4>loading map</h4>;
}

function renderPopulatedMap(pets, cityData) {
  //console.log("renderPopulatedMap");
  // TODO - eventually the map will move and recenter
  let coordinates = { lat: 1, lng: 1 };
  if (pets[0].location && pets[0].location.coordinates) {
    coordinates = {
      lat: pets[0].location.coordinates[1],
      lng: pets[0].location.coordinates[0],
    };
  } else {
    coordinates = getCoordinatesFromCityData(cityData);
  }
  return (
    <GoogleMap resetBoundsOnResize={true} defaultZoom={13} center={coordinates}>
      {renderCirclesForPets(pets)}
    </GoogleMap>
  );
}

function getCoordinatesFromCityData(cityData) {
  let coordinates = { lat: 1, lng: 1 };
  if (cityData && cityData.cities && cityData.cities[0]) {
    coordinates = {
      lat: cityData.cities[0].lat,
      lng: cityData.cities[0].lng,
    };
  }
  return coordinates;
}

function renderEmptyMap(cityData) {
  let coordinates = getCoordinatesFromCityData(cityData);
  //console.log("render empty map " + coordinates.lat);
  return (
    <GoogleMap
      resetBoundsOnResize={true}
      defaultZoom={13}
      center={coordinates}
      options={{ disableDefaultUI: true }}
    >
      <InfoWindow position={coordinates}>
        <div>Could not find any pets.</div>
      </InfoWindow>
    </GoogleMap>
  );
}

function renderCirclesForPets(pets) {
  let count = 0;
  return pets.map((pet, index) => {
    if (pet.location && pet.location.coordinates) {
      const coordinates = {
        lat: pet.location.coordinates[1],
        lng: pet.location.coordinates[0],
      };

      return (
        <Circle key={count++} id={pet._id} center={coordinates} radius={200} />
      );
    }
  });
}

export const MapWithCircles = withScriptjs(withGoogleMap(GoogleSearchMap));
