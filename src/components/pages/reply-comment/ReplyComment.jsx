import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { getCookie } from "cookies-next";
import { useTranslation } from "next-i18next";
// FUNCTION
import { getDate } from "@functions/getDate";

const ViolationReportBottomSheet = dynamic(
  () => import("@components/common/ViolationReportBottomSheet"),
  { ssr: false }
);

export default function ReplyComment({ data }) {
  const lang = getCookie("NEXT_LOCALE");
  const { t } = useTranslation();
  const [openViolationReportBottomSheet, setOpenViolationReportBottomSheet] = useState(false);

  return (
    <>
      <div className="py-[18px] mx-6" dir={lang == "ar" ? "rtl" : ""}>
        <div className={`flex items-center`}>
          <div className="relative w-[54px] h-[54px]">
            <Image
              src="/assets/images/user-icon.png"
              layout="fill"
              alt="profile_user"
              className="rounded-full cover-center-img"
            ></Image>
          </div>
          <div className={`flex flex-col mr-2 ltr:ml-2`}>
            <span className="font-medium text-[12px] leading-[22px] text-black mb-[5px]">
              {data.creator.name}
              {data.name}
            </span>
            <span className="font-normal text-[12px] leading-[22px] text-gray4">
              {getDate(data.createdAt, lang)}
              {data.date}
            </span>
          </div>
        </div>
        <div className="mt-4 mx-2 font-normal text-[12px] text-right h-[44px] leading-[22px] text-black break-words">
          {data?.text?.slice(0, 90)}
        </div>
        <div className="flex items-center justify-between mt-[5px]">
          <div onClick={() => setOpenViolationReportBottomSheet(true)}>
            <span
              className={`font-normal text-[11px] leading-[33px]  mx-2  text-gray4 pl-1 ltr:pr-1`}
            >
              {t("violationReport")}
            </span>
          </div>
        </div>
      </div>
      <ViolationReportBottomSheet
        lang={lang}
        t={t}
        setOpenViolationReportBottomSheet={setOpenViolationReportBottomSheet}
        openViolationReportBottomSheet={openViolationReportBottomSheet}
        targetType="COMMENT"
        targetId={data._id}
      />
    </>
  );
}
