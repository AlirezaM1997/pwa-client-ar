import { getDate } from "@functions/getDate";
import { getCookie } from "cookies-next";
import { getParticipationStatusName } from "@functions/getParticipationStatusName";
import CustomButton from "@components/kit/button/CustomButton";
import { moneyFormatter } from "@functions/moneyFormatter";
import { useWindowSize } from "@uidotdev/usehooks";
import BottomSheet from "@components/common/BottomSheet";
import CustomTransitionModal from "@components/kit/modal/CustomTransitionModal";
import { useState } from "react";
import Receipt from "./Receipt";

export default function ReceiptCard({ receipt, key, tPA, t }) {
  const lang = getCookie("NEXT_LOCALE");
  const size = useWindowSize();
  const [openReceipt, setOpenReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

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
      <div
        className="py-[22px] border-b-[1px] lg:border-[1px] lg:p-3 border-gray5 lg:rounded-lg flex flex-col justify-between"
        key={key}
      >
        <div>
          <h1 className="heading ">{receipt.project?.title}</h1>

          <div className="flex items-center justify-between mt-[9px] mb-[6px]">
            <p>{getDate(receipt.createdAt, lang, true)}</p>
            <div
              className={`text-[10px] leading-[16px] font-normal px-3 py-1 rounded-md ${getStatusClassname(
                receipt.status
              )}`}
            >
              {getParticipationStatusName(receipt.status, lang)}
            </div>
          </div>

          <div>
            {receipt.type === "FINANCIAL" ? (
              <div className="flex items-center justify-between bg-gray5 rounded-md py-[8px] px-3 mt-[14px] mb-3">
                <p className="text-[14px] leading-[24px] font-normal">{t("price")}</p>
                <p className="text-[14px] leading-[24px] font-bold">
                  {moneyFormatter(receipt.amount)} {t("toman")}
                </p>
              </div>
            ) : receipt.type === "PRESSENCE" ? (
              <div className="mt-[6px] mb-3"></div>
            ) : (
              <div className="mt-[6px] mb-3" style={{ wordBreak: "break-word" }}>
                <p className="text-gray2 text-[14px] leading-[24px] font-normal">
                  {String(receipt?.description)?.slice(0, 140)}{" "}
                  {String(receipt?.description).length > 140 ? "..." : ""}
                </p>
              </div>
            )}
          </div>
        </div>

        <CustomButton
          title={tPA("getReceipt")}
          isFullWidth={true}
          onClick={() => {
            setOpenReceipt(true);
            setReceiptData(receipt);
          }}
        />
      </div>

      {size.width < 960 ? (
        <BottomSheet open={openReceipt} setOpen={setOpenReceipt} disableDrag={true}>
          <Receipt data={receiptData} />
        </BottomSheet>
      ) : (
        <CustomTransitionModal open={openReceipt} close={() => setOpenReceipt(false)} width="500px">
          <Receipt data={receiptData} />
        </CustomTransitionModal>
      )}
    </>
  );
}
