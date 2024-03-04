import dynamic from "next/dynamic";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
// COMPONENT
import BackButton from "@components/common/BackButton";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
// COMPONENT DYNAMIC IMPORT
const ShowLocation = dynamic(() => import("@components/common/ShowLocation"), {
  ssr: false,
});

export default function ShowFullScreenLocation({
  lat,
  lng,
  showFullScreenMap,
  setShowFullScreenMap,
  zoom = 10,
}) {
  const lang = getCookie("NEXT_LOCALE");
  const [_lat, _setLat] = useState(null);
  const [_lng, _setLng] = useState(null);

  useEffect(() => {
    _setLat(lat);
    _setLng(lng);
  }, [lat, lng]);

  return (
    <>
      <div
        className={`${
          showFullScreenMap ? "block" : "hidden"
        } w-full fixed inset-0 h-screen z-[9999999]`}
      >
        <div className=" absolute top-3 ltr:left-4 rtl:right-4 z-[999]">
          <BackButton
            bgColor="bg-main8"
            arrowColor="#03A6CF"
            width="w-[32px]"
            height="h-[32px]"
            onClick={() => {
              setShowFullScreenMap(false);
              document.body.style.overflow = "unset";
            }}
            dir={["Ar", "ar"].includes(lang) ? "right" : "left"}
          />
        </div>

        {_lat && _lng && (
          <ShowLocation
            lat={_lat}
            lng={_lng}
            zoom={zoom}
            dragging={true}
            scrollWheelZoom={true}
            touchZoom={true}
          />
        )}

        {(!_lat || !_lng) && <LoadingScreen />}
      </div>
    </>
  );
}
