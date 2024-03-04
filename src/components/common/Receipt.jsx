import { getCookie } from "cookies-next";
import Image from "next/legacy/image";
import { useTranslation } from "react-i18next";
//FUNCTION
import { getParticipationStatusName } from "@functions/getParticipationStatusName";
import { moneyFormatter } from "@functions/moneyFormatter";
import { getDate } from "@functions/getDate";
import { getRequirementsName } from "@functions/getRequirementsName";

const getSvgPath = (status) => {
  const lookup = {
    PENDING: "/assets/svg/pendingTick.svg",
    REJECTED: "/assets/svg/rejectedTick.svg",
    APPROVED: "/assets/svg/successTick.svg",
  };
  const result = lookup[status];
  return result;
};

const getStatusColor = (status) => {
  const lookup = {
    PENDING: "text-warning",
    REJECTED: "text-error",
    APPROVED: "text-success",
  };
  const result = lookup[status];
  return result;
};

export default function Receipt({ data }) {
  const lang = getCookie("NEXT_LOCALE");
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col items-center p-4 pb-11 text-[14px] leading-[24px] font-medium">
        <div className="border-b-[1px] border-dashed border-[#DADADA] pb-6 w-full flex flex-col items-center">
          <div className="relative w-14 h-14">
            <Image src={getSvgPath(data?.status)} layout="fill" alt="status"></Image>
          </div>
          <p className={`mt-4 w-full text-center ${getStatusColor(data?.status)}`}>
            {getParticipationStatusName(data?.status, lang)}
          </p>
          {data.type === "FINANCIAL" && (
            <h6 className="text-[24px] leading-[38px] font-medium pt-4">
              {moneyFormatter(data?.amount)} {t("toman")}
            </h6>
          )}
        </div>
        <div className="flex flex-col items-start w-full mt-3">
          <div className="py-3 border-b-[1px] border-[#F3F3F3] w-full">
            <p className="text-[#9F9F9F]">{t("project")}</p>
            <p className="">{data?.project?.title}</p>
          </div>
          <div className="py-3 border-b-[1px] border-[#F3F3F3] w-full">
            <p className="text-[#9F9F9F]">{t("time")}</p>
            <p className="">{getDate(data?.createdAt, lang, true)}</p>
          </div>
          <div className="py-3">
            <p className="text-[#9F9F9F]">{t("participationType")}</p>
            <p className="">{getRequirementsName(data?.type, lang)}</p>
          </div>
          {data.type !== "FINANCIAL" && data.type !== "PRESSENCE" && (
            <div className="py-3 border-t-[1px] border-[#F3F3F3] w-full">
              <p className="text-[#9F9F9F]">{t("overView")}</p>
              <p className="" style={{ wordBreak: "break-word" }}>
                {data?.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
