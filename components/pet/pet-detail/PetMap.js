import React from "react";
import { MapWithGeocode } from "../map/GoogleMap";

class PetMap extends React.Component {
  //state = {  }
  render() {
    const location = this.props.location;

    const apiKey = "AIzaSyAn2UKSxv1p9vwuluwdoWzfchiA1eRteAM";
    const url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`;

    return (
      <MapWithGeocode
        {...this.props}
        {...this.state}
        googleMapURL={url}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `300px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        location={location}
      />
    );
  }
}

export default PetMap;
