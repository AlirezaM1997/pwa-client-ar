import { useEffect, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

export default function Requirement({
  setOpen,
  t,
  requirements,
  setRequirements,
  isInParticipation,
}) {
  const isMobile = useWindowSize().width < 960;

  const [selectedItems, setSelectedItems] = useState(requirements);

  useEffect(() => {
    setSelectedItems(requirements);
  }, [requirements]);

  const array = [
    {
      id: 0,
      name: t("requirements.financial"),
      value: "FINANCIAL",
    },
    { id: 1, name: t("requirements.moral"), value: "MORAL" },
    { id: 2, name: t("requirements.ideas"), value: "IDEAS" },
    {
      id: 3,
      name: t("requirements.capacity"),
      value: "CAPACITY",
    },
    { id: 4, name: t("requirements.skill"), value: "SKILL" },
    {
      id: 5,
      name: t("requirements.pressence"),
      value: "PRESENCE",
    },
  ];

  const confirm = () => {
    setRequirements(selectedItems);
  };

  const handleCheckBox = (e, item) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, item.value]);
    } else {
      setSelectedItems(selectedItems.filter((i) => i !== item.value));
    }
  };

  return (
    <div className="lg:p-[25px]">
      <div className="px-4 lg:px-0 text-black pb-[20px] lg:pb-[24px] lg:border-b lg:border-gray5">
        <h1
          className={`titleInput lg:text-[18px] lg:font-bold lg:leading-[20px] ${
            isInParticipation ? "" : "lg:mb-3"
          }`}
        >
          {!isInParticipation ? t("requiredServices") : t("participationType")}
        </h1>
        {!isInParticipation && (
          <p className="font-light text-[14px] pt-2 lg:py-0 lg:text-[16px] lg:leading-[20px] lg:font-normal">
            {t("requireDec")}
          </p>
        )}
      </div>
      <div className="caption1 px-4 pb-5 lg:p-0 lg:mt-[15px] lg:mb-[18px]">
        {array.map((item, index) => (
          <div
            className={`flex items-center gap-[10px] ${index === 0 ? "pt-0" : "pt-[18px]"}`}
            key={index}
          >
            <input
              id={index * 3}
              type="checkbox"
              name={item.name}
              value={item.name}
              onChange={(e) => handleCheckBox(e, item)}
              className="lg:!w-[22px] lg:!h-[22px]"
              checked={selectedItems.filter((i) => i == item.value).length !== 0}
            />
            <label
              htmlFor={index * 3}
              className="text-gray1 lg:text-[16px] lg:leading-[20px] lg:font-normal"
            >
              {item.name}
            </label>
          </div>
        ))}
      </div>
      <div className="px-4 pb-[20px] mt-4 lg:p-0 lg:mt-0">
        <CustomButton
          title={t("confirm")}
          styleType="Primary"
          size={isMobile ? "S" : "M"}
          textColor={"text-white"}
          onClick={() => {
            confirm();
            setOpen(false);
          }}
          isFullWidth={true}
        />
      </div>
    </div>
  );
}
