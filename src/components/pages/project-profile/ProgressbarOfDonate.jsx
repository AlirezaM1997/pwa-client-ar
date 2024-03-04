import { useTranslation } from "next-i18next";
// FUNCTION
import { moneyFormatter } from "@functions/moneyFormatter";
import ProgressBar from "@components/kit/Input/ProgressBar";

export default function ProgressbarOfDonate({
  financialRequirement,
  projectRequirementData,
  showSupportersCount = false,
}) {
  const { donatePercentage, participationsFinancialAmount, participationsCount } =
    projectRequirementData;
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between pr-0.5">
        <div className="flex flex-row gap-1 caption4 text-black tracking-[-0.24px]">
          <span>{moneyFormatter(participationsFinancialAmount)}</span>
          <span>{t("of")}</span>
          <span>
            {financialRequirement ? moneyFormatter(financialRequirement) : 0} {t("toman")}
          </span>
        </div>
        <span className="text-gray3 caption4">{donatePercentage} %</span>
      </div>
      <ProgressBar value={donatePercentage} />
      {showSupportersCount && (
        <span className="caption3 text-gray4 mt-[5px]">
          {participationsCount}
          {" " + t("project-profile.supporter")}
        </span>
      )}
    </div>
  );
}
