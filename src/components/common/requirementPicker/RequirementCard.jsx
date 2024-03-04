import { Edit } from "iconsax-react";
import { getCookie } from "cookies-next";
import { useWindowSize } from "@uidotdev/usehooks";
//FUNCTION
import { getDate } from "@functions/getDate";
import { moneyFormatter } from "@functions/moneyFormatter";
import { getRequirementsName } from "@functions/getRequirementsName";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

export default function RequirementCard({
  index,
  item,
  t,
  temporaryRequirements,
  setTemporaryRequirements,
  editMode,
  setTemporaryDeletedRequirements,
  setOpenSkill,
  setOpenCapacity,
  setOpenPressence,
  setOpenIdeas,
  setOpenMoral,
  setOpenFinancial,
  setSkill,
  setCapacity,
  setPressence,
  setIdeas,
  setMoral,
  setFinancial,
  setEditModeIndex,
}) {
  const lang = getCookie("NEXT_LOCALE");
  const size = useWindowSize();
  const _delete = (index) => {
    if (editMode) {
      setTemporaryDeletedRequirements((prev) => [...prev, temporaryRequirements[index]]);
    }
    setTemporaryRequirements(temporaryRequirements.filter((x, i) => i !== index));
  };
  const edit = (item, index) => {
    setEditModeIndex(index);
    if (item.type === "FINANCIAL") {
      setOpenFinancial(true);
      setFinancial({ amount: item.amount });
    } else if (item.type === "MORAL") {
      setOpenMoral(true);
      setMoral({ description: item.description });
    } else if (item.type === "IDEAS") {
      setOpenIdeas(true);
      setIdeas({ description: item.description });
    } else if (item.type === "CAPACITY") {
      setOpenCapacity(true);
      setCapacity({ description: item.description });
    } else if (item.type === "SKILL") {
      setOpenSkill(true);
      setSkill({ description: item.description });
    } else {
      setOpenPressence(true);
      setPressence({ description: item.description });
    }
  };
  return (
    <div className="border border-gray5 rounded-lg mb-[20px]">
      <div className="flex items-center justify-between border-b-[1px] border-gray5 pt-[11px] pb-3 px-[9px]">
        <div className="flex items-center gap-[6px]">
          <span className="caption1 text-black">
            {`${t("requirement")} ${getRequirementsName(item.type, lang)}`}
          </span>
          <Edit color="#2E2E2E" size={14} onClick={() => edit(item, index)} />
        </div>
        <div className="flex items-center text-black caption1 gap-1">
          <span>{t("date")} .</span>
          <span>{getDate(new Date(), lang)}</span>
        </div>
      </div>
      <div className="py-[10px] px-[9px]">
        <div className="caption1">
          {item.type === "FINANCIAL" ? (
            <div className="flex items-center justify-between mb-[20px]">
              <span className="text-gray3">{t("requirementAmount")}</span>
              <div>
                <span className="text-black rtl:ml-1 ltr:mr-1">{moneyFormatter(item.amount)}</span>
                <span className="text-black">{t("toman")}</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-gray3 mb-[10px]">{t("description")}</div>
              <div className="text-black mb-[10px]">
                {size.width > 960
                  ? item.description?.slice(0, 190)
                  : item.description?.slice(0, 110)}
                {item.description?.length > 150 ? "..." : ""}
              </div>
            </div>
          )}
        </div>
        <CustomButton
          bgColor="bg-[#FBE8E8]"
          onClick={() => _delete(index)}
          title={`${t("choseSubjects.deleteRequirement")} ${getRequirementsName(item.type, lang)}`}
          textColor="text-danger"
          isFullWidth={true}
        />
      </div>
    </div>
  );
}
