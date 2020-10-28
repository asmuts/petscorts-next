import React from "react";
import cache from "../../../util/simple-cache";

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Circle,
  InfoWindow,
} from "react-google-maps";

function MapComponent(props) {
  const { coordinates, isError, isLocationLoaded } = props;
  if (isError) {
    return (
      <GoogleMap
        defaultZoom={13}
        defaultCenter={coordinates}
        options={{ disableDefaultUI: true }}
      >
        <InfoWindow position={coordinates}>
          <div>Could not find location.</div>
        </InfoWindow>
      </GoogleMap>
    );
  }
  if (isLocationLoaded) {
    return (
      <GoogleMap defaultZoom={13} defaultCenter={coordinates}>
        <Circle center={coordinates} radius={500} />
      </GoogleMap>
    );
  } else {
    return <h4>loading map</h4>;
  }
}

// TODO: I can now get geoCodes from the pets
// There's no need to look them up on the client
function withGeocode(WrappedComponent) {
  return class extends React.Component {
    constructor() {
      super();

      this.state = {
        coordinates: {
          lat: 0,
          lng: 0,
        },
        isError: false,
        isLocationLoaded: false,
      };
    }

    componentDidMount() {
      this.getGeocodeLocation();
    }

    updateCoordinates(coordinates) {
      this.setState({
        coordinates: coordinates,
        isError: false,
        isLocationLoaded: true,
      });
    }

    geocodeLocation(location) {
      const geocoder = new window.google.maps.Geocoder();

      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: location }, (result, status) => {
          if (status === "OK") {
            const geometry = result[0].geometry.location;
            const coordinates = {
              lat: geometry.lat(),
              lng: geometry.lng(),
            };
            cache.put(location, coordinates);
            resolve(coordinates);
          } else {
            reject("Error");
          }
        });
      });
    }

    getGeocodeLocation() {
      const location = this.props.location;

      if (cache.has(location)) {
        const coordinates = cache.get(location);
        console.log("got location from cache");
        this.updateCoordinates(coordinates);
      } else {
        this.geocodeLocation(location).then(
          (coordinates) => {
            this.updateCoordinates(coordinates);
          },
          (error) => {
            console.log(error);
            this.setState({ isError: true });
          }
        );
      }
    }

    render() {
      return <WrappedComponent {...this.props} {...this.state} />;
    }
  };
}

export const MapWithGeocode = withScriptjs(
  withGoogleMap(withGeocode(MapComponent))
);
