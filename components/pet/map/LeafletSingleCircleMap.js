import React, { Component } from "react";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
L.Icon.Default.imagePath = "/";

class LeafletSingleCircleMap extends Component {
  constructor(props) {
    super(props);

    const { coordinates } = props;
    //console.log(coordinates);
    this.state = {
      center: {
        lat: coordinates[1],
        lng: coordinates[0],
      },
      zoom: 13,
      scrollWheelZoom: false,
    };
  }

  render() {
    if (!this.state.center) {
      return <div></div>;
    }
    const position = [this.state.center.lat, this.state.center.lng];
    const circlePosition = position;

    return (
      <>
        <style jsx>
          {`
            //Fill the container. The parent can set the size.
            .map-root {
              //height: 375px;
              height: 100%;
            }
          `}
        </style>
        <div className="map-root">
          <MapContainer
            center={position}
            zoom={this.state.zoom}
            scrollWheelZoom={this.state.scrollWheelZoom}
            style={{ height: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle center={circlePosition} radius="300"></Circle>
          </MapContainer>
        </div>
      </>
    );
  }
}

export default LeafletSingleCircleMap;
