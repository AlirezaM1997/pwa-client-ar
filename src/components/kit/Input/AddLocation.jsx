// LEAFLET
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { AddLocationMarker } from "@lib/svg";
import { useState, useEffect, useRef } from "react";

import { Gps } from "iconsax-react";
import { useGeolocated } from "react-geolocated";
import { useWindowSize } from "@uidotdev/usehooks";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
// COMPONENT
import CustomButton from "../button/CustomButton";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });

export default function AddLocation({
  t,
  setModalLocation,
  modalLocation,
  setLocationPoint,
  locationPoint,
  buttonTitle = t("pickProjectPlace"),
}) {
  const size = useWindowSize();
  const [selectedPosition, setSelectedPosition] = useState([
    locationPoint?.lat ? locationPoint.lat : 33.97594293751557,
    locationPoint?.lng ? locationPoint.lng : 53.31774214354411,
  ]);
  const [showMyLocation, setShowMyLocation] = useState(false);

  useEffect(() => {
    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 100);
    setSelectedPosition({
      lat: locationPoint?.lat ?? 33.97594293751557,
      lng: locationPoint.lng ?? 53.31774214354411,
    });
  }, [modalLocation]);

  const Markers = () => {
    const map = useMapEvents({
      move() {
        setSelectedPosition({ lat: map.getCenter().lat, lng: map.getCenter().lng });
      },
    });
    return null;
  };

  const markerIcon = new L.Icon({
    iconUrl: "/assets/svg/currentLocation.svg",
    iconSize: [28, 44],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });

  const mapRef = useRef();

  const { coords, getPosition, isGeolocationAvailable, isGeolocationEnabled, positionError } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
      watchLocationPermissionChange: true,
    });

  const goToMyLocation = () => {
    if (coords) {
      setShowMyLocation(true);
    } else {
      getPosition();
      if (positionError) {
        toast.custom(() => <Toast text={t("myLocationError")} status="WARNING" />);
      }
    }
  };

  function ChangeMapView() {
    const map = useMap();
    map?.flyTo([coords.latitude, coords.longitude], 14, {
      animate: true,
    });
    setShowMyLocation(false);
  }

  return (
    <>
      <section className="relative w-full h-screen flex flex-col items-center">
        <div className="w-full ">
          <MapContainer
            key={1}
            draggable={true}
            center={selectedPosition}
            zoom={size.width < 960 ? 5 : 7}
            scrollWheelZoom={true}
            style={{ height: "100vh" }}
            minZoom={4}
            ref={mapRef}
          >
            <Markers />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {coords && (
              <Marker icon={markerIcon} position={[coords.latitude, coords.longitude]}></Marker>
            )}
            {coords && showMyLocation && <ChangeMapView />}
          </MapContainer>
          <button
            onClick={goToMyLocation}
            type="button"
            className="z-[1003] w-[44px] h-[44px] fixed bottom-[80px] right-4 bg-white rounded-full flex items-center justify-center"
          >
            <Gps size={22} />
          </button>
        </div>
        <div className="z-[1001] fixed top-1/2 -translate-y-[34px]">
          <AddLocationMarker w={40.4} h={58} />
        </div>
        <div className="z-[1001] fixed bottom-[20px] w-full px-4">
          <CustomButton
            isFullWidth={true}
            onClick={() => {
              document.body.style.overflow = "unset";
              setLocationPoint(selectedPosition);
              setModalLocation(false);
            }}
            title={buttonTitle}
            size="S"
          />
        </div>
      </section>
    </>
  );
}
