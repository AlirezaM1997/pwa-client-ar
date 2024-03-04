import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import CustomButton from "@components/kit/button/CustomButton";
import { FilterPaticipationStatusEnum, getParticipationStatusName } from "@functions/getParticipationStatusName";

export default function ParticipationStatus({ setOpen, t, status, setStatus }) {
  const lang = getCookie("NEXT_LOCALE");
  const size = useWindowSize();
  const isMobile = size.width < 960;
  const [selectedItems, setSelectedItems] = useState(status);

  useEffect(() => {
      setSelectedItems(status)
    }, [status])
    
    const confirm = () => {
      setStatus(selectedItems);
    };

  const handleCheckBox = (e, item) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    }
  };

  return (
    <div className="px-4 lg:p-[25px]">
      <div className="flex flex-col text-black pb-[20px] lg:pb-[20px] lg:border-b lg:border-gray5">
        <h1 className="titleInput lg:text-[18px] lg:leading-[20px]">
          {t("statusHeader")}
        </h1>
      </div>
      <div className="caption1 flex flex-col lg:mt-[19px] lg:mb-[27px]">
        {FilterPaticipationStatusEnum.map((item, index) => (
          <div
            className={`flex items-center gap-x-[10px] lg:pb-0 ${
              index === 0 ? "pt-0" : "pt-[24px]"
            }`}
            key={index + "status"}
          >
            <input
              id={index * 3 + "status"}
              type="checkbox"
              onChange={(e) => handleCheckBox(e, item)}
              checked={selectedItems.filter((i) => i == item).length !== 0}
              className="lg:!w-[22px] lg:!h-[22px]"
            />
            <label
              htmlFor={index * 3 + "status"}
              className="text-gray1 lg:text-[16px]"
            >
              {getParticipationStatusName(item, lang)}
            </label>
          </div>
        ))}
      </div>
      <div className="pb-[20px] pt-5 lg:py-0">
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
