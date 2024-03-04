// LEAFLET
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

const svgIcon = L.divIcon({
  html: `
  <svg width="37" height="53" viewBox="0 0 37 53" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M27.1624 47.8767C27.1624 50.3755 23.1063 52.4036 18.1085 52.4036C13.1108 52.4036 9.05469 50.3755 9.05469 47.8767C9.05469 45.6585 12.2416 43.8205 16.4426 43.4312C16.9859 43.3769 17.5381 43.3497 18.1085 43.3497C19.7971 43.3351 21.4774 43.5856 23.0882 44.0921C25.5418 44.907 27.1624 46.3013 27.1624 47.8767Z" fill="#03A6CF" fill-opacity="0.2"/>
  <path d="M36.2126 17.9984C36.2139 20.7288 35.5962 23.4239 34.406 25.8812C33.2158 28.3386 31.484 30.4941 29.3407 32.1858C25.5339 35.161 22.564 39.0729 20.7215 43.5393C20.6128 43.8019 20.5132 44.0554 20.4136 44.3179L19.807 45.9839C19.6774 46.3306 19.445 46.6296 19.1408 46.8406C18.8365 47.0518 18.4751 47.1648 18.1049 47.1648C17.7347 47.1648 17.3733 47.0518 17.0691 46.8406C16.7648 46.6296 16.5324 46.3306 16.4028 45.9839L15.7962 44.3179C15.6966 44.0554 15.597 43.8019 15.4974 43.5393C13.7039 39.1048 10.7712 35.2226 6.99582 32.2854C4.75491 30.5502 2.95437 28.3115 1.73997 25.7506C0.525671 23.1898 -0.0683523 20.3788 0.0062515 17.5457C0.153467 12.8037 2.156 8.30879 5.58297 5.02791C9.00995 1.747 13.5877 -0.0578949 18.3316 0.00141687C23.0756 0.0607377 27.6067 1.97951 30.9506 5.34508C34.2945 8.71069 36.184 13.2542 36.2126 17.9984Z" fill="#03A6CF"/>
  <path d="M18.1049 26.2362C22.6544 26.2362 26.3426 22.5481 26.3426 17.9985C26.3426 13.4489 22.6544 9.7608 18.1049 9.7608C13.5553 9.7608 9.86719 13.4489 9.86719 17.9985C9.86719 22.5481 13.5553 26.2362 18.1049 26.2362Z" fill="#FDFDFD"/>
  <path d="M17.2014 36.1063C17.2014 35.6063 16.796 35.2009 16.296 35.2009C15.796 35.2009 15.3906 35.6063 15.3906 36.1063C15.3906 36.6063 15.796 37.0117 16.296 37.0117C16.796 37.0117 17.2014 36.6063 17.2014 36.1063Z" fill="#CCE8EE"/>
  <path d="M20.8186 36.1063C20.8186 35.6063 20.4132 35.2009 19.9132 35.2009C19.4132 35.2009 19.0078 35.6063 19.0078 36.1063C19.0078 36.6063 19.4132 37.0117 19.9132 37.0117C20.4132 37.0117 20.8186 36.6063 20.8186 36.1063Z" fill="#CCE8EE"/>
  </svg>     
  `,
  className: "",
  iconSize: [40.4, 58],
  iconAnchor: [20.2, 29],
});

export default function ShowLocation({
  lat,
  lng,
  zoom = 4,
  dragging,
  touchZoom = false,
  scrollWheelZoom = false,
}) {
  const [_lat, _setLat] = useState(lat);
  const [_lng, _setLng] = useState(lng);

  function ChangeMapView() {
    const map = useMap();
    map.setView({ lat: _lat, lng: _lng });
    return null;
  }

  useEffect(() => {
    _setLat(lat);
    _setLng(lng);
  }, [lat, lng]);

  return (
    <>
      <MapContainer
        draggable={false}
        tap={false}
        touchZoom={touchZoom}
        keyboard={false}
        tapTolerance={false}
        dragging={dragging}
        center={[_lat, _lng]}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
      >
        <Marker position={[_lat, _lng]} icon={svgIcon}></Marker>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeMapView />
      </MapContainer>
    </>
  );
}
