import { useWindowSize } from "@uidotdev/usehooks";
import { CardReceive, CardSend } from "iconsax-react";
// FUNCTION
import { getDate } from "@functions/getDate";

export default function TransactionCard({
  tW,
  t,
  isDeposit,
  isSuccess,
  isFailed,
  date,
  amount,
  lang,
}) {
  const size = useWindowSize();
  return (
    <>
      {size.width < 960 ? (
        <div className="flex items-center justify-between py-5 border-b-[1px] border-gray5 cursor-pointer">
          <div className="flex items-center gap-x-[9px]">
            <div
              className={`w-[44px] h-[44px] rounded-full flex items-center justify-center ${
                isSuccess ? "bg-[#E3F2EC]" : isFailed ? "bg-[#F5E7E5]" : "bg-[#FF88001F]"
              }`}
            >
              {isDeposit ? (
                <CardReceive
                  size={24}
                  color={isSuccess ? "#43936C" : isFailed ? "#CB3A31" : "#FF8800"}
                />
              ) : (
                <CardSend
                  size={24}
                  color={isSuccess ? "#43936C" : isFailed ? "#CB3A31" : "#FF8800"}
                />
              )}
            </div>
            <div className="">
              <h4 className="heading">{isDeposit ? tW("deposit") : tW("withdrawal")}</h4>
              <p className="caption1 text-gray2">{`${t("date")} . ${getDate(date, lang, true)}`}</p>
            </div>
          </div>
          <div className="heading text-main1">{`${amount} ${t("toman")}`}</div>
        </div>
      ) : (
        <div className="py-5 border-b-[1px] border-gray5 cursor-pointer grid grid-cols-3 items-center text-gray2 text-[16px] leading-[30px] font-medium">
          <div className="flex items-center gap-x-[9px]">
            <div
              className={`w-[35px] h-[35px] rounded-full flex items-center justify-center ${
                isSuccess ? "bg-[#E3F2EC]" : isFailed ? "bg-[#F5E7E5]" : "bg-[#FF88001F]"
              }`}
            >
              {isDeposit ? (
                <CardReceive
                  size={17}
                  color={isSuccess ? "#43936C" : isFailed ? "#CB3A31" : "#FF8800"}
                />
              ) : (
                <CardSend
                  size={17}
                  color={isSuccess ? "#43936C" : isFailed ? "#CB3A31" : "#FF8800"}
                />
              )}
            </div>

            <h4>{isDeposit ? tW("deposit") : tW("withdrawal")}</h4>
          </div>
          <p>{getDate(date, lang, true)}</p>
          <div className="text-main1">{`${amount} ${t("toman")}`}</div>
        </div>
      )}
    </>
  );
}
