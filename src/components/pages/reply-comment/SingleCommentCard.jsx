import { Like } from "@lib/svg";
import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { getCookie } from "cookies-next";
import { useMutation } from "@apollo/client";
import { useTranslation } from "next-i18next";
// FUNCTION
import { getDate } from "@functions/getDate";
// GQL
import { LIKE_COMMENT } from "@services/gql/mutation/LIKE_COMMENT";
// COMPONENT DYNAMIC IMPORT
const ViolationReportBottomSheet = dynamic(
  () => import("@components/common/ViolationReportBottomSheet"),
  { ssr: false }
);

export default function SingleCommentCard({ data, refetch }) {
  const lang = getCookie("NEXT_LOCALE");
  const { t } = useTranslation();
  const [openViolationReportBottomSheet, setOpenViolationReportBottomSheet] = useState(false);

  const [Like_comments] = useMutation(LIKE_COMMENT);

  const onChangeLike = async (likeStatus) => {
    const variables = {
      commentId: data._id,
      state: likeStatus,
    };
    try {
      const {
        data: {
          like_comment: { status },
        },
      } = await Like_comments({ variables });
      if (status === 200) {
        refetch();
      }
    } catch (error) {
      console.log("its ERROR", error);
    }
  };

  return (
    <>
      <div className="py-[10px] mx-6" dir={lang == "ar" ? "rtl" : ""}>
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
              {data?.creator?.name}
            </span>
            <span className="font-normal text-[12px] leading-[22px] text-gray4">
              {getDate(data?.createdAt, lang)}
            </span>
          </div>
        </div>
        <div className="mt-4 mx-2 font-normal text-[12px] text-right h-[44px] leading-[22px] text-black break-words">
          {data?.text?.slice(0, 90)}
        </div>
        <div className="flex items-center justify-between mt-[15px]">
          <div className="flex items-center">
            <div className={`flex items-center mr-3 ltr:ml-3`}>
              <div
                onClick={() => onChangeLike("LIKE")}
                className="bg-gray3 w-[21px] h-[21px] rounded-full flex items-center justify-center"
              >
                <Like w={9} h={8.16} />
              </div>
              <div
                className={`font-normal text-[11px] leading-[33px] text-gray4 flex items-center pl-6 ltr:pr-6 pr-[6px] ltr:pl-[6px]`}
              >
                <span>{data?.likeCount}</span>
                <p className="px-1">{t("person")}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div
                onClick={() => onChangeLike("DISLIKE")}
                className="bg-gray3 w-[21px] h-[21px] rounded-full flex items-center justify-center"
              >
                <Like w={9} h={8.16} dir="down" />
              </div>
              <div
                className={`font-normal text-[11px] leading-[33px] text-gray4 flex items-center pr-[6px] ltr:pl-[6px]`}
              >
                <span>{data?.dislikeCount}</span>
                <p className="px-1">{t("person")}</p>
              </div>
            </div>
          </div>
          <div onClick={() => setOpenViolationReportBottomSheet(true)}>
            <span className={`font-normal text-[11px] leading-[33px] text-gray4 pl-1 ltr:pr-1`}>
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
