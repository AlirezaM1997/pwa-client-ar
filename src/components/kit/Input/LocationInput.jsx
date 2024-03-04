import { useState } from "react";
import dynamic from "next/dynamic";
import { Gps, LocationAdd } from "iconsax-react";
// COMPONENT DYNAMIC IMPORT
const AddLocation = dynamic(() => import("./AddLocation"), { ssr: false });
const ShowLocation = dynamic(() => import("@components/common/ShowLocation"), {
  ssr: false,
});
const ErrorBox = dynamic(() => import("@components/common/ErrorBox"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });

export default function LocationInput({
  t,
  value,
  setValue,
  errorText,
  errorKind,
  buttonTitle,
  iconSize = 16,
}) {
  const [modalLocation, setModalLocation] = useState(false);
  return (
    <>
      <div className="mb-[25px] lg:mb-0 relative">
        <label
          className={`flex items-center gap-[6px] justify-start  mb-[8px] lg:mb-[10px] pointer-events-none`}
          htmlFor="map"
        >
          <Gps size={iconSize} />
          <h5 className="titleInput ">{t("map")}</h5>
        </label>
        <button
          type="button"
          id="map"
          className={`w-full h-[136px] lg:h-[247px] rounded-lg border-[1px] border-gray5 outline-none flex flex-col items-center justify-center overflow-hidden`}
          onClick={() => setModalLocation(true)}
        >
          {!value.lat ? (
            <>
              <LocationAdd color="#D7D7D7" size={35} />
              <p className="caption3 lg:caption5 text-gray4 mt-[15px]">{t("pickMapPoint")}</p>
            </>
          ) : (
            <div className="w-full h-full">
              <ShowLocation lat={value.lat} lng={value.lng} dragging={false} />
            </div>
          )}
        </button>
        <div className="mt-3">
          <ErrorBox text={errorText} kind={errorKind} />
        </div>
      </div>
      {modalLocation && (
        <ModalScreen open={modalLocation}>
          <AddLocation
            t={t}
            modalLocation={modalLocation}
            setModalLocation={setModalLocation}
            setLocationPoint={setValue}
            locationPoint={value}
            buttonTitle={buttonTitle}
          />
        </ModalScreen>
      )}
    </>
  );
}
