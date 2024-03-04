import { useTranslation } from "next-i18next";
import ProgressBar from "@components/kit/Input/ProgressBar";
// FUNCTION
import { moneyFormatter } from "@functions/moneyFormatter";

export default function MapProgressBar({ data }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between caption4 text-gray4">
        <div className="flex flex-row gap-1">
          <span className="text-black text-[10px] font-normal ">
            {moneyFormatter(data?.participationsFinancialAmount) +
              " " +
              t("of") +
              " " +
              moneyFormatter(data?.totalFinancialAmount) +
              " " +
              t("toman")}
          </span>
        </div>
        <p className="text-[11px] text-gray2">{data?.participationsCount + " " + t("supporter")}</p>
      </div>
      <div className="mt-[5px]">
        <ProgressBar value={data?.donatePercentage} styles={"w-full"} />
      </div>
    </div>
  );
}
