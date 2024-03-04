import Image from "next/legacy/image";
import { getDate } from "@functions/getDate";
import { getCookie } from "cookies-next";
import { getParticipationStatusName } from "@functions/getParticipationStatusName";

export default function BelongingLicenseCard({ data }) {
  const lang = getCookie("NEXT_LOCALE");

  const getStatusClassname = (status) => {
    if (status === "PENDING") {
      return "text-warning bg-[#F9F5EA]";
    } else if (status === "APPROVED") {
      return "text-success bg-[#E7F6ED]";
    } else {
      return "text-danger bg-[#FDF3F3]";
    }
  };

  return (
    <>
      <div className="flex items-center py-6 justify-start gap-[10px]">
        <div className="relative w-[76px] h-[86px]">
          <Image
            src={data?.setadImage ?? "/assets/images/default-association-image.png"}
            layout="fill"
            alt="setad_image"
            className="rounded-[6px] cover-center-img"
          ></Image>
        </div>
        <div className="flex flex-col">
          <span className="title1 text-black">{data.setadName}</span>

          <span className="my-1">{getDate(data.createdAt, lang, true)}</span>

          <div
            className={`text-[14px] leading-[16px] font-normal w-fit px-6 py-3 rounded-lg ${getStatusClassname(
              data.status
            )}`}
          >
            {getParticipationStatusName(data.status, lang)}
          </div>
        </div>
      </div>
    </>
  );
}
