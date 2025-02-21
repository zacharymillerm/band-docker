"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = L.icon({
  iconUrl: "/leaflet-icons/marker-icon.png",
  iconRetinaUrl: "/leaflet-icons/marker-icon-2x.png",
  shadowUrl: "/leaflet-icons/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapComponent = () => {
  const [coordinates, setCoordinates] = useState([55.765433, 37.853596]); // Default to Moscow center

  // useEffect(() => {
  //   const provider = new OpenStreetMapProvider();

  //   provider
  //     .search({ query: "Москва, г. Реутов, ул. Победы, 20" })
  //     .then((result) => {
  //       if (result && result.length > 0) {
  //         const { x, y } = result[0];
  //         setCoordinates([y, x]);
  //       }
  //     });
  // }, []);

  return (
    <div className="mapContainer">
      <div className="mapStyle">
        <MapContainer
          center={coordinates}
          zoom={13}
          style={{ height: "100%", width: "100%", zIndex: "1" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={coordinates} icon={customIcon}>
            <Popup>Москва, г. Реутов, ул. Победы, 20</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
