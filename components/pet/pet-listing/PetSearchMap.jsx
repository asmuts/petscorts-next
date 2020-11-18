import React from "react";
import { MapWithCircles } from "./GoogleSearchMap";

class PetSearchMap extends React.Component {
  render() {
    // TODO make configurable
    const apiKey = "AIzaSyAn2UKSxv1p9vwuluwdoWzfchiA1eRteAM";
    const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`;

    return (
      <MapWithCircles
        {...this.props}
        {...this.state}
        googleMapURL={url}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `80vh` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}

export default PetSearchMap;
