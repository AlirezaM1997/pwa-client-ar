import { useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { Refresh2, TickCircle, CloseCircle } from "iconsax-react";
// FUNCTION
import { moneyFormatter } from "@functions/moneyFormatter";
// COMPONENT
import CustomButton from "@components/kit/button/CustomButton";
import dynamic from "next/dynamic";
// COMPONENT DYNAMIC IMPORT
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const CustomTransitionModal = dynamic(() => import("@components/kit/modal/CustomTransitionModal"), {
  ssr: false,
});

const requirements_header_title = (type, tPA) => {
  const lookup = {
    FINANCIAL: tPA("myParticipations.financial"),
    MORAL: tPA("myParticipations.moral"),
    IDEAS: tPA("myParticipations.ideas"),
    CAPACITY: tPA("myParticipations.valency"),
    PRESSENCE: tPA("myParticipations.inPerson"),
    SKILL: tPA("myParticipations.professional"),
  };
  return lookup[type];
};

const status_styles = (tPA, isMobile) => ({
  APPROVED: {
    bgColor: "bg-success",
    title: tPA("myParticipations.approved"),
    textColor: "text-white",
    icon: <TickCircle size={isMobile ? 16 : 18} variant="Bold" color="white" />,
  },
  PENDING: {
    bgColor: "bg-gray5",
    textColor: "text-gray4",
    title: tPA("myParticipations.pending"),
    icon: <Refresh2 size={isMobile ? 16 : 18} color="#ACACAF" />,
  },
  REJECTED: {
    bgColor: "bg-danger",
    textColor: "text-white",
    title: tPA("myParticipations.rejected"),
    icon: <CloseCircle size={isMobile ? 16 : 18} variant="Bold" color="white" />,
  },
});

export default function ParticipationCard({ t, tPA, lang = "en", participation, classNames = "" }) {
  const [open, setOpen] = useState(false);
  const isMobile = useWindowSize().width < 960;
  const { createdAt, type, description, title, amount, status } = participation;
  const button_style =
    type === "FINANCIAL"
      ? status_styles(tPA, isMobile)["APPROVED"]
      : status_styles(tPA, isMobile)[status];

  return (
    <>
      <div
        className={`w-full border-[1px] my-10  border-gray6 rounded-lg mb-5 lg:flex lg:flex-col lg:mb-0 ${classNames}`}
      >
        <div className="flex items-center justify-between border-b-[1.5px] border-gray6 px-2 lg:px-3 py-[13px] lg:py-4">
          <div className="flex items-center title2 text-black lg:titleDesktop4">
            {requirements_header_title(type, tPA)}
          </div>
          <div className="flex items-center gap-1 lg:gap-2 caption2 lg:titleDesktop4">
            <p className="text-gray4">{tPA("myParticipations.date")}</p>
            <span className="text-black">
              {/* {(createdAt, "YYYY-MM-DD").locale(lang).format("YYYY/MM/DD")} */}
            </span>
          </div>
        </div>
        <div className="px-2 pt-4 pb-[13px] lg:px-3 lg:pt-[20px] lg:pb-[24px] lg:flex lg:flex-col lg:flex-1 lg:justify-between">
          <div className="mb-[20px] lg:mb-0">
            {type === "FINANCIAL" ? (
              <div className="flex items-center justify-between">
                <span className="caption2 text-gray3 lg:titleDesktop4">
                  {tPA("myParticipations.price")}
                </span>
                <div className="flex gap-1 items-center textInput lg:titleDesktop4">
                  <span className="text-black">{moneyFormatter(amount)}</span>
                  <span className="text-black">{t("toman")}</span>
                </div>
              </div>
            ) : (type === "PRESSENCE" || type === "IDEAS") && description?.length !== 0 ? (
              <div className="caption2 lg:captionDesktop4 text-black break-words">
                {title?.slice(0, 155)}
                {title?.length > 155 ? "..." : ""}
              </div>
            ) : (
              <>
                {description.length !== 0 && (
                  <div className="caption2 lg:captionDesktop4 text-black break-words">
                    {description?.slice(0, 155)}
                    {description?.length > 155 ? "..." : ""}
                  </div>
                )}
              </>
            )}
          </div>
          <CustomButton
            bgColor={button_style.bgColor}
            icon={button_style.icon}
            title={button_style.title}
            textColor={button_style.textColor}
            size={isMobile ? "XS" : "S"}
            isFullWidth={true}
            onClick={() => setOpen(true)}
          />
        </div>
      </div>
      {isMobile ? (
        <BottomSheet open={open} setOpen={setOpen}>
          <div className="flex flex-col px-4 mt-[5px] mb-[17px]">
            <div className="mb-[8px] flex items-center heading text-black">
              {requirements_header_title(type, tPA)}
            </div>
            <div className="flex items-center gap-1 caption2 mb-[10px]">
              <p className="text-gray4">{tPA("myParticipations.date")}</p>
              <span className="text-black">
                {/* {(createdAt, "YYYY-MM-DD").locale(lang).format("YYYY/MM/DD")} */}
              </span>
            </div>
            <div className="mb-[20px]" dir={lang == "ar" ? "rtl" : "ltr"}>
              {type === "FINANCIAL" ? (
                <div className="flex items-center justify-between">
                  <span className="caption2 text-gray3">{tPA("myParticipations.price")}</span>
                  <div className="flex gap-1 items-center textInput">
                    <span className="text-black">{moneyFormatter(amount)}</span>
                    <span className="text-black">{t("toman")}</span>
                  </div>
                </div>
              ) : (type === "PRESSENCE" || type === "IDEAS") && description?.length !== 0 ? (
                <div className="caption2 text-black break-words">{title}</div>
              ) : (
                <>
                  {description.length !== 0 && (
                    <div className="caption2 text-black break-words">{description}</div>
                  )}
                </>
              )}
            </div>
            <CustomButton
              bgColor={button_style.bgColor}
              icon={button_style.icon}
              title={button_style.title}
              textColor={button_style.textColor}
              size="XS"
              isFullWidth={true}
            />
          </div>
        </BottomSheet>
      ) : (
        <CustomTransitionModal open={open} close={() => setOpen(false)} width="711px">
          <div className="flex flex-col p-[25px]">
            <div className="flex items-center flex-row pb-4 mb-[21px] border-b border-gray6">
              <div className="titleDesktop4 text-black ml-1.5 mr-1.5">
                {requirements_header_title(type, tPA)}
              </div>
              <div className="flex items-center flex-row gap-2 titleDesktop4">
                <p className="text-gray4">{tPA("myParticipations.date")}</p>
                <span className="text-black">
                  {/* {(createdAt, "YYYY-MM-DD").locale(lang).format("YYYY/MM/DD")} */}
                </span>
              </div>
            </div>
            <div className="mb-[23px] captionDesktop4 text-black">
              {type === "FINANCIAL" ? (
                <div className="flex items-center justify-between">
                  <span className="caption2 text-gray3">{tPA("myParticipations.price")}</span>
                  <div className="flex gap-1 items-center">
                    <span>{moneyFormatter(amount)}</span>
                    <span>{t("toman")}</span>
                  </div>
                </div>
              ) : (type === "PRESSENCE" || type === "IDEAS") && description?.length !== 0 ? (
                <div className="break-words">{title}</div>
              ) : (
                <>{description.length !== 0 && <div className="break-words">{description}</div>}</>
              )}
            </div>
            <CustomButton
              bgColor={button_style.bgColor}
              icon={button_style.icon}
              title={button_style.title}
              textColor={button_style.textColor}
              size="S"
              isFullWidth={true}
            />
          </div>
        </CustomTransitionModal>
      )}
    </>
  );
}
