"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

const customIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Restaurant {
  _id: string;
  restaurant_name: string;
  latitude: number;
  longitude: number;
  ratings: {
    food: number;
    water: number;
    utensils: number;
    interior_design: number;
    location: number;
    vibes: number;
  };
}

export default function Map({ restaurants }: { restaurants: Restaurant[] }) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "/marker-icon.png",
      iconRetinaUrl: "/marker-icon-2x.png",
      shadowUrl: "/marker-shadow.png",
    });
  }, []);

  const center: [number, number] = [40.4406, -79.9959];

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "500px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant._id}
          position={[restaurant.latitude, restaurant.longitude]}
          icon={customIcon}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg">{restaurant.restaurant_name}</h3>
              <div className="mt-2 text-sm">
                <p>Food: {restaurant.ratings.food}/10</p>
                <p>Water: {restaurant.ratings.water}/10</p>
                <p>Vibes: {restaurant.ratings.vibes}/10</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
