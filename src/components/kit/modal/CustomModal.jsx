import { useTranslation } from "react-i18next";
// COMPONENT
import CustomButton from "@components/kit/button/CustomButton";
import { CloseCircle } from "iconsax-react";

export default function CustomModal({
  title = "",
  titleColor = "text-black",
  description = "",
  icon = null,
  hasCloseBtn=false,
  hasOneButton = false,
  oneButtonOnClick,
  oneButtonLabel,
  okOnClick,
  cancelOnClick,
  okLabel,
  cancelLabel,
  okBgColor = "bg-main2",
  openState,
  bgColor="bg-[#31313133]"
}) {
  const { t } = useTranslation();
  return (
    <>
      <div
        className={`${
          openState ? "block" : "hidden"
        } fixed w-full h-screen !z-[10000000] ${bgColor} backdrop-blur-[2px] top-0 right-0`}
        style={{ zIndex: 10000000 }}
        onClick={cancelOnClick}
      >
        <section
          className="absolute bg-white h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[10px] w-[328px] shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-5 flex flex-col items-center relative">
            {hasCloseBtn && <CloseCircle onClick={cancelOnClick} className="absolute top-[20px] rtl:right-4 ltr:left-4 cursor-pointer"/>}
            {icon && <div className="mb-5">{icon}</div>}
            <h1 className={`${titleColor} text-center heading`}>{title}</h1>
            <p className="text-gray3 pt-3 pb-5 text-center caption2">{description}</p>
            {hasOneButton ? (
              <CustomButton
                title={oneButtonLabel || t("gotIt")}
                styleType="Primary"
                size={"S"}
                onClick={oneButtonOnClick}
                isFullWidth={true}
              />
            ) : (
              <div className="flex items-center gap-x-3 w-full">
                <CustomButton
                  bgColor={okBgColor}
                  title={okLabel || t("yes")}
                  styleType="Primary"
                  size={"S"}
                  onClick={okOnClick}
                  isFullWidth={true}
                />
                <CustomButton
                  title={cancelLabel || t("no")}
                  styleType="Primary"
                  size={"S"}
                  onClick={cancelOnClick}
                  isFullWidth={true}
                  bgColor="bg-gray5"
                  textColor="text-gray1"
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
