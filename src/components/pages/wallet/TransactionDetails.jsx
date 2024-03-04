import Image from "next/legacy/image";
import { Import } from "iconsax-react";
// FUNCTION
import { formatCartNumber } from "@functions/formatCartNumber";
// COMPONENT
import StatusBadge from "./StatusBadge";

export default function TransactionDetails({
  t,
  tW,
  isIncrease = true,
  status,
  amount,
  date,
  shabaNumber,
  cartNumber,
  description,
}) {
  const getTargetElement = () => document.getElementById("content-id");
  return (
    <>
      <div id="content-id">
        {String(status).toUpperCase() === "DONE" ? (
          <div className="flex flex-col items-center">
            <div className="relative w-[72px] h-[72px]">
              <Image src="/assets/images/success-icon.png" layout="fill" alt="success-icon"></Image>
            </div>
            <h2 className="text-[20px] font-medium lg:text-[18px] lg:font-bold leading-[30px] mt-4">
              {isIncrease ? tW("doneIncrease") : tW("doneIncrease")}
            </h2>
          </div>
        ) : String(status).toUpperCase() === "FAIL" ? (
          <div className="flex flex-col items-center">
            <div className="relative w-[72px] h-[72px]">
              <Image src="/assets/images/failed-icon.png" layout="fill" alt="failed-icon"></Image>
            </div>
            <h2 className="text-[20px] font-medium lg:text-[18px] lg:font-bold leading-[30px] mt-4">
              {isIncrease ? tW("failedIncrease") : tW("failedIncrease")}
            </h2>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-[72px] h-[72px]">
              <Image src="/assets/images/pend-icon.png" layout="fill" alt="pend-icon"></Image>
            </div>
            <h2 className="text-[20px] font-medium lg:text-[18px] lg:font-bold leading-[30px] mt-4">
              {isIncrease ? tW("pendIncrease") : tW("pendWithdrawal")}
            </h2>
          </div>
        )}
        <div className="bg-gray6 rounded-2xl px-3 py-5 mt-5 mb-9">
          <div className="flex items-center justify-between mb-4">
            <p className="caption1 text-gray1">{t("amount")}</p>
            <p className="heading">{`${amount} ${t("toman")}`}</p>
          </div>
          <div className="flex items-center justify-between border-b-[1px] border-gray5 pb-7">
            <p className="caption1 text-gray1">{tW("paymentStatus")}</p>
            <StatusBadge tW={tW} status={String(status).toUpperCase()} />
          </div>
          <div className="flex items-center justify-between mb-4 pt-3">
            <p className="caption1 text-gray1">{tW("paymentTime")}</p>
            <p className="caption4">{date}</p>
          </div>
          {!isIncrease && (
            <div className="flex items-center justify-between">
              <p className="caption1 text-gray1">{tW("destinationAccount")}</p>
              <p className="caption4">{shabaNumber || formatCartNumber(cartNumber)}</p>
            </div>
          )}
          {!isIncrease && (
            <div className="flex items-center justify-between mt-4">
              <p className="caption1 text-gray1">{t("description")}</p>
              <p className="caption4">{description ? description : ""}</p>
            </div>
          )}
        </div>
      </div>
      {/* <button
        onClick={() => null}
        className="border-[1px] border-gray5 rounded-lg p-3 flex items-center gap-x-[10px] w-full justify-center"
      >
        <Import size={24} />
        <p className="cta2">{tW("getPdf")}</p>
      </button> */}
    </>
  );
}
