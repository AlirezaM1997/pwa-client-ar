import Detail from "./Detail";
import { useState } from "react";
import dynamic from "next/dynamic";
import { getCookie } from "cookies-next";
import { useWindowSize } from "@uidotdev/usehooks";
// FUNCTION
import { getDate } from "@functions/getDate";
// COMPONENT DYNAMIC IMPORT
const TopOfCard = dynamic(() => import("./TopOfCard"), { ssr: false });
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const CustomButton = dynamic(() => import("@components/kit/button/CustomButton"), { ssr: false });
const CustomTransitionModal = dynamic(() => import("@components/kit/modal/CustomTransitionModal"), {
  ssr: false,
});

export default function Card({ t, tPM, data }) {
  const [_data, _setData] = useState(data);
  const [openDetail, setOpenDetail] = useState(false);
  const lang = getCookie("NEXT_LOCALE");
  const size = useWindowSize();
  const [openDottedMenu, setOpenDottedMenu] = useState(false);

  return (
    <div
      className="flex flex-col p-3 justify-center items-center border-gray5 border-2 rounded-2xl w-full"
      onClick={() => setOpenDottedMenu(false)}
    >
      <TopOfCard
        data={_data}
        tPM={tPM}
        t={t}
        participator={_data?.participator?.name}
        participatorImage={_data?.participator?.image}
        lang={lang}
        openDottedMenu={openDottedMenu}
        setOpenDottedMenu={setOpenDottedMenu}
      />

      <div className="flex flex-row w-full mt-3 gap-2">
        <p className="caption2 lg:captionDesktop2 text-gray2">{getDate(_data.createdAt, lang)}</p>
      </div>
      {_data?.type !== "FINANCIAL" && (
        <p className="w-full caption2 lg:captionDesktop4 lg:h-[120px] text-black mt-[2px] mb-[14px] lg:mt-3 lg:mb-[27px] break-words">
          {_data?.description
            ? `${_data.description.slice(0, 155)} ${_data.description.length > 155 ? "..." : ""}`
            : ""}
        </p>
      )}
      {_data?.type === "FINANCIAL" && (
        <div className="flex flex-row justify-start w-full lg:h-[110px] mt-[7px] mb-[21px] lg:mt-[19px] lg:mb-[30px] gap-2">
          <p className="text-gray3 caption2 lg:titleDesktop1 lg:leading-[20px] lg:font-medium">
            {tPM("depositAmount")}
          </p>
          <p className="text-gray3 caption2 lg:titleDesktop1 lg:leading-[20px] lg:font-medium">
            {"."}
          </p>
          <p className="text-main2 heading lg:titleDesktop1 lg:leading-[20px]">
            {Number(_data?.amount).toLocaleString()} {t("toman")}
          </p>
        </div>
      )}
      <CustomButton
        onClick={() => {
          setOpenDetail(true);
        }}
        size={size.width < 960 ? "XS" : "S"}
        title={tPM("moreDetail")}
        isFullWidth={true}
      />
      {size.width < 960 ? (
        <BottomSheet open={openDetail} setOpen={setOpenDetail}>
          <Detail
            t={t}
            tPM={tPM}
            setOpen={setOpenDetail}
            data={_data}
            setData={_setData}
          />
        </BottomSheet>
      ) : (
        <CustomTransitionModal open={openDetail} close={() => setOpenDetail(false)} width="730px">
          <Detail
            t={t}
            tPM={tPM}
            setOpen={setOpenDetail}
            data={_data}
            setData={_setData}
          />
        </CustomTransitionModal>
      )}
    </div>
  );
}
