import "swiper/css";
import cx from "classnames";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useTranslation } from "next-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { useWindowSize } from "@uidotdev/usehooks";
import { Skill, Capacity, Pressence } from "@lib/svg";
import { EmptyWallet, HeartCircle, LampCharge } from "iconsax-react";
import SquareBoxWithIcon from "@components/common/SquareBoxWithIcon";
// FUNCTION
import { moneyFormatter } from "@functions/moneyFormatter";
import { getRequirementsName } from "@functions/getRequirementsName";
// COMPONENT
import BackButton from "@components/common/BackButton";
import ProgressbarOfDonate from "./ProgressbarOfDonate";
import LinkAsButtonWithIcon from "./LinkAsButtonWithIcon";
// COMPONENT DYNAMIC IMPORT
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const CustomTransitionModal = dynamic(() => import("@components/kit/modal/CustomTransitionModal"), {
  ssr: false,
});

const getRequirementsDescription = (requirement, smallTextMode = true) => {
  let text = "";
  if (smallTextMode) {
    text = (text) => (text ? text.slice(0, 100) + (text.length > 100 ? "..." : "") : "");
  } else {
    text = (text) => text;
  }
  return text(requirement?.description);
};

const getRequirementsIcon = (type, isMobile) => {
  const lookup = {
    MORAL: <HeartCircle size={isMobile ? 13 : 20} color="#03A6CF" />,
    CAPACITY: <Capacity w={isMobile ? 13 : 20} />,
    PRESSENCE: <Pressence w={isMobile ? 13 : 20} />,
    SKILL: <Skill w={isMobile ? 13 : 20} />,
    IDEAS: <LampCharge size={isMobile ? 13 : 20} color="#03A6CF" />,
  };
  const result = lookup[String(type).toUpperCase()];
  return result;
};

export default function RequirementSlides({
  dir,
  isRequest,
  projectId,
  donateDisabled = false,
  requirements,
  projectRequirementData,
  financialRequirement,
}) {
  const lang = getCookie("NEXT_LOCALE");
  const { t } = useTranslation();
  const router = useRouter();
  const isMobile = useWindowSize().width < 960;
  const financial = requirements.find((x) => x.type === "FINANCIAL");
  /////////////////////STATES/////////////////////
  const [openRequirementModla, setOpenRequirementModal] = useState(false);
  const [dataForBottomSheet, setDataForBottomSheet] = useState(null);

  /////////////////////FUNCTIONS/////////////////////
  const handleOnClick = (data) => {
    if (isRequest) {
      setOpenRequirementModal(true);
      setDataForBottomSheet(data);
    } else {
      router.push(
        `/participation/${String(getRequirementsName(data.type, "en"))
          .toLowerCase()
          .replace(/\s/g, "")}/${projectId}?participationID=${data._id}`,
        undefined,
        { shallow: true }
      );
    }
  };

  return (
    <div>
      {financial && (
        <div
          className="flex flex-col gap-[10px] bg-gray6 pl-2 pr-[9px] pt-[7px] pb-3 rounded-lg lg:w-[58%] cursor-pointer"
          onClick={
            !isRequest && !donateDisabled
              ? () =>
                  router.push(
                    `/participation/${String(
                      getRequirementsName("FINANCIAL", "en")
                    ).toLowerCase()}/${projectId}`,
                    undefined,
                    { shallow: true }
                  )
              : () => null
          }
        >
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2">
              <SquareBoxWithIcon
                size="37px"
                classNames="bg-[#56C3E033] rounded-lg"
                icon={<EmptyWallet size={19} color="#03A6CF" />}
              />
              <div className="flex flex-col">
                <span className="cta3 text-black">{t("project-profile.requiredAmount")}</span>
                <span className="title1 text-main3">
                  {financialRequirement ? moneyFormatter(financialRequirement) : 0} {t("toman")}
                </span>
              </div>
            </div>
            {!isRequest && (
              <LinkAsButtonWithIcon
                href={`/participation/${String(
                  getRequirementsName("FINANCIAL", "en")
                ).toLowerCase()}/${projectId}`}
                icon={
                  <BackButton
                    arrowColor={donateDisabled ? "#ACACAF" : "#03A6CF"}
                    bgColor={donateDisabled ? "bg-gray8" : "bg-main7"}
                    dir={dir === "rtl" ? "left" : "right"}
                    width="w-4"
                    height="h-4"
                    iconSize={8}
                  />
                }
                text={t("project-profile.financialDonate")}
                classNames="gap-[6px] text-main2 caption4 rounded-md bg-white p-[7px] mt-[5px]"
                disabled={donateDisabled}
              />
            )}
          </div>
          {!isRequest && (
            <ProgressbarOfDonate
              financialRequirement={financialRequirement}
              showSupportersCount={true}
              projectRequirementData={projectRequirementData}
            />
          )}
        </div>
      )}
      <div className={`mt-2 lg:mt-4`}>
        <Swiper slidesPerView="auto" spaceBetween={7}>
          {requirements.map(
            (item, i) =>
              item.type !== "FINANCIAL" && (
                <SwiperSlide
                  key={item.type + i}
                  className=" !w-[170px] !h-[170px] lg:!w-[265px] lg:!h-[170px]"
                >
                  <div
                    className="flex flex-col justify-between gap-2 pt-[10px] pb-3 pl-[7px] pr-[5px] bg-gray8 h-full rounded-lg cursor-pointer"
                    onClick={() => {
                      !donateDisabled ? handleOnClick(item) : "";
                    }}
                  >
                    <div className="grid grid-cols-[22px_auto] lg:grid-cols-[25px_auto] gap-x-2 mb-1">
                      <SquareBoxWithIcon
                        size={isMobile ? "22px" : "25px"}
                        classNames="bg-[#56C3E033] rounded"
                        icon={getRequirementsIcon(item.type, isMobile)}
                      />
                      <p
                        className={cx("caption4 text-gray1  break-words overflow-hidden", {
                          "text-right": dir === "rtl",
                        })}
                      >
                        {getRequirementsDescription(item, true)}
                      </p>
                    </div>

                    <div className="block w-max h-max mx-auto">
                      <div
                        className={cx(
                          `flex flex-row justify-center items-center h-max w-max gap-[10px] caption4 text-main2 rounded-md bg-white py-[7px] px-[9px]`,
                          { "!text-gray4 cursor-default": donateDisabled }
                        )}
                      >
                        {!isRequest ? (
                          <div className="flex items-center ltr:flex-row rtl:flex-row-reverse gap-x-1">
                            <span>
                              {getRequirementsName(item.type, lang).charAt(0).toUpperCase() +
                                getRequirementsName(item.type, lang).slice(1)}
                            </span>
                            <span>{t("project-profile.donate")}</span>
                          </div>
                        ) : (
                          <div className="flex items-center ltr:flex-row rtl:flex-row-reverse gap-x-1">
                            <span>
                              {getRequirementsName(item.type, lang).charAt(0).toUpperCase() +
                                getRequirementsName(item.type, lang).slice(1)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex justify-center items-center w-[20px] h-[20px] rounded-full ${
                            donateDisabled ? "bg-[#A8ABB133]" : "bg-main8"
                          }`}
                        >
                          <BackButton
                            arrowColor={donateDisabled ? "#ACACAF" : "#03A6CF"}
                            bgColor={donateDisabled ? "bg-gray8" : "bg-main8"}
                            dir={dir === "rtl" ? "left" : "right"}
                            width="w-5"
                            height="h-5"
                            iconSize={8}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              )
          )}
        </Swiper>
      </div>
      {isMobile ? (
        <BottomSheet open={openRequirementModla} setOpen={setOpenRequirementModal}>
          <div className="flex flex-col gap-2 px-4 pb-5 ">
            <div className="flex flex-row items-center gap-[7px] mb-1">
              <SquareBoxWithIcon
                size="22px"
                classNames="bg-[#56C3E033] rounded"
                icon={getRequirementsIcon(dataForBottomSheet?.type, isMobile)}
              />
              <span>{getRequirementsName(dataForBottomSheet?.type, lang)}</span>
            </div>
            <p
              className={cx("caption4 text-gray1 max-h-[300px] overflow-y-auto ", {
                "text-right": dir === "rtl",
              })}
            >
              {getRequirementsDescription(dataForBottomSheet, false)}
            </p>
          </div>
        </BottomSheet>
      ) : (
        <CustomTransitionModal
          open={openRequirementModla}
          close={() => setOpenRequirementModal(false)}
          width="776px"
          undefined
        >
          <div className="flex flex-col gap-2 px-4 pb-6 text-black lg:p-[25px]">
            <div className="flex flex-row items-center gap-[13px] mb-[17px]">
              <SquareBoxWithIcon
                size="40px"
                classNames="bg-[#56C3E033] rounded"
                icon={getRequirementsIcon(dataForBottomSheet?.type, isMobile)}
              />
              <span className="titleDesktop4 leading-[34px]">
                {getRequirementsName(dataForBottomSheet?.type, lang)}
              </span>
            </div>
            <p
              className={cx("captionDesktop4 max-h-[300px] overflow-y-auto", {
                "text-right": dir === "rtl",
              })}
            >
              {getRequirementsDescription(dataForBottomSheet, false)}
            </p>
          </div>
        </CustomTransitionModal>
      )}
    </div>
  );
}
