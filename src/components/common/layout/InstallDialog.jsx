import dynamic from "next/dynamic";
import { ReceiveSquare } from "iconsax-react";
import { useWindowSize } from "@uidotdev/usehooks";
import { usePWAInstall } from "react-use-pwa-install";
import { isAndroid, isDesktop, isIOS } from "react-device-detect";
//FUNCTION
import { saveToStorage } from "@functions/saveToStorage";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";
//COMPONENT
const CustomTransitionModal = dynamic(() => import("@components/kit/modal/CustomTransitionModal"), {
  ssr: false,
});

export default function InstallDialog({ showSuggestInstall, setShowSuggestInstall, t }) {
  const size = useWindowSize();
  const install = usePWAInstall();

  const handleConfirm = () => {
    if (isIOS || isDesktop || isAndroid) {
      setShowSuggestInstall(false);
      saveToStorage("INSTALL_DIALOG", 1);
      install();
    } else {
      saveToStorage("INSTALL_DIALOG", 1);
      const newWindow = window.open(
        "https://play.google.com/store/apps/details?id=com.mofid.app",
        "_blank",
        "noopener,noreferrer"
      );
      if (newWindow) newWindow.opener = null;
    }
  };

  return (
    <>
      <CustomTransitionModal
        hasCloseBtn={true}
        open={showSuggestInstall}
        close={() => {
          setShowSuggestInstall(false);
          saveToStorage("INSTALL_DIALOG", 1);
        }}
        width={size.width < 960 ? "320px" : "450px"}
      >
        <div className="flex flex-col items-center p-[25px]">
          <div>
            <ReceiveSquare size={80} color="#03A6CF" />
          </div>
          <h1 className="pt-[40px] pb-[25px]">
            {isIOS || isDesktop ? t("installPWA") : t("installApp")}
          </h1>
          <div className="flex w-full gap-x-3">
            <CustomButton
              onClick={() => {
                setShowSuggestInstall(false);
                saveToStorage("INSTALL_DIALOG", 1);
                document.body.style.overflow = "unset";
              }}
              bgColor="bg-gray5"
              textColor="text-black"
              title={t("notNow")}
              size="S"
              isFullWidth={true}
            />
            <CustomButton
              onClick={() => {
                handleConfirm();
                setShowSuggestInstall(false);
                document.body.style.overflow = "unset";
              }}
              bgColor="bg-main2"
              title={t("install")}
              size="S"
              isFullWidth={true}
              id="install-button"
            />
          </div>
        </div>
      </CustomTransitionModal>
    </>
  );
}
