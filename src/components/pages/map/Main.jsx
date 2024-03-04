// LEAFLET
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import L from "leaflet";

import dynamic from "next/dynamic";
import { Gps } from "iconsax-react";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGeolocated } from "react-geolocated";
import { useWindowSize } from "@uidotdev/usehooks";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
// COMPONENT
import MarkerCluster from "./MarkerCluster";
import Offcanvas from "@components/common/Offcanvas";
import ProjectCardOffcanvas from "./ProjectCardOffcanvas";
import AssociationCardOffcanvas from "./AssociationCardOffcanvas";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const AssociationCard = dynamic(() => import("@components/kit/card/association-card/Main"), {
  ssr: false,
});
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const ProjectCard = dynamic(() => import("@components/kit/card/project-card/Main"), { ssr: false });

export default function HomeMap({
  result,
  loading,
  center,
  setCenter,
  openOffcanvas,
  setOpenOffcanvas,
  setCoordinates,
}) {
  const { t } = useTranslation();
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [instanceInfo, setInstanceInfo] = useState(null);
  const [showMyLocation, setShowMyLocation] = useState(false);
  const [clickedMyLocationBtn, setClickedMyLocationBtn]= useState(false)
  const size = useWindowSize();

  const markerIcon = new L.Icon({
    iconUrl: "/assets/svg/currentLocation.svg",
    iconSize: [28, 44],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });

  const mapRef = useRef();

  const { coords, getPosition, isGeolocationEnabled, positionError } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
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
        console.log("location positionError: ", positionError)
        if (positionError.message === "User denied Geolocation") {
          toast.custom(() => <Toast text={t("letPermissionForLocation")} status="WARNING" />);
          setClickedMyLocationBtn(true)
        } else {
          toast.custom(() => <Toast text={t("myLocationError")} status="WARNING" />);
        }
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

  useEffect(()=> {
    if (isGeolocationEnabled && clickedMyLocationBtn) setShowMyLocation(true)
  }, [isGeolocationEnabled, clickedMyLocationBtn])

  return (
    <>
      {(!result || loading) && (
        <div className=" absolute ltr:right-7 rtl:left-7 lg:left-1/2 lg:rtl:-translate-x-1/2 top-[66px] lg:top-[135px] z-[1003]">
          <div
            className="inline-block h-6 w-6 lg:h-8 lg:w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
          </div>
        </div>
      )}
      <MapContainer
        center={center}
        zoom={size.width < 960 ? 5 : 7}
        minZoom={size.width < 960 ? 4 : 4}
        scrollWheelZoom={true}
        worldCopyJump={true}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerCluster
          result={result}
          setOpen={size.width < 960 ? setOpenBottomSheet : setOpenOffcanvas}
          setInstanceInfo={setInstanceInfo}
          setCenter={setCenter}
          center={center}
          setCoordinates={setCoordinates}
        />
        {coords && (
          <Marker icon={markerIcon} position={[coords.latitude, coords.longitude]}></Marker>
        )}
        {coords && showMyLocation && <ChangeMapView />}
      </MapContainer>
      <button
        onClick={goToMyLocation}
        className="z-[1003] w-[44px] h-[44px] fixed bottom-[160px] right-4 bg-white rounded-full flex items-center justify-center"
      >
        <Gps size={22} />
      </button>

      {/* show project or associaton data in BottomSheet modal in mobile device*/}
      <BottomSheet open={openBottomSheet} setOpen={setOpenBottomSheet}>
        <div className="px-4 pb-4">
          {instanceInfo?.__typename === "Project" ? (
            <ProjectCard
              isRequest={false}
              isPrivate={false}
              t={t}
              loadingHeight="h-[260px]"
              cardId={instanceInfo?._id}
              hasBorder={false}
              imgHeight="h-[180px] 400:h-[220px] 480:h-[240px]"
            />
          ) : (
            <AssociationCard
              t={t}
              loadingHeight="h-[260px]"
              cardId={instanceInfo?._id}
              hasBorder={false}
              imgHeight="h-[180px] 400:h-[220px] 480:h-[240px]"
            />
          )}
        </div>
      </BottomSheet>

      {/* show project or associaton data in sidebar when desktop device*/}
      <div className="hidden lg:block">
        <Offcanvas
          isOpen={openOffcanvas}
          width="w-[360px]"
          margin="ltr:-ml-[360px] rtl:-mr-[360px]"
        >
          {instanceInfo?.__typename === "Project" ? (
            <ProjectCardOffcanvas
              setOpenOffcanvas={setOpenOffcanvas}
              projectId={instanceInfo?._id}
              isPrivate={false}
              t={t}
            />
          ) : (
            <AssociationCardOffcanvas
              setOpenOffcanvas={setOpenOffcanvas}
              associationId={instanceInfo?._id}
              t={t}
            />
          )}
        </Offcanvas>
      </div>
    </>
  );
}
