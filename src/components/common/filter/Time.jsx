import { useState } from "react";
import { Delete } from "@lib/svg";
import { getCookie } from "cookies-next";
import { useWindowSize } from "@uidotdev/usehooks";
import arabic from "react-date-object/calendars/arabic"
import arabic_ar from "react-date-object/locales/arabic_ar"
import gregorian from "react-date-object/calendars/gregorian";
import { Calendar, DateObject } from "react-multi-date-picker";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { weekDaysEnglish, weekDaysArabic } from "@constants/index";
//FUNCTION
import { toEnglishDigits } from "@functions/toEnglishDigits";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";
//COMPONENT DYNAMIC IMPORT
export default function Time({ setOpen, t, minDate, maxDate, setMinDate, setMaxDate }) {
  const lang = getCookie("NEXT_LOCALE");
  const isMobile = useWindowSize().width < 960;

  const [selectedRangeDate, setSelectedRangeDate] = useState([minDate, maxDate]);

  const confirm = () => {
    if (selectedRangeDate) {
      setMinDate(
        selectedRangeDate[0] ? toEnglishDigits(new DateObject(selectedRangeDate[0]).format()) : null
      );
      setMaxDate(
        selectedRangeDate[1] ? toEnglishDigits(new DateObject(selectedRangeDate[1]).format()) : null
      );
      setOpen(false);
    } else {
      setOpen(false);
    }
  };

  const deleteFilter = () => {
    setMinDate(null);
    setMaxDate(null);
    setOpen(false);
  };

  return (
    <>
      <div className="lg:flex lg:items-center lg:flex-col lg:w-full lg:p-5">
        <div className="mb-5 px-[14px] lg:px-0 lg:mb-0 text-black lg:pb-[24px] lg:border-b lg:border-gray5 lg:w-full">
          <div className="flex flex-row justify-between lg:mb-3 items-center">
            <h1 className="text-[16px] font-bold lg:text-[18px] lg:leading-[20px] ">
              {t("period")}
            </h1>
            <div className={`px-4 lg:px-8 ${minDate || maxDate ? "" : "hidden"}`}>
              <button
                onClick={() => deleteFilter()}
                className="py-[7px] px-2 text-danger caption4 bg-[#FCF1F1] rounded flex items-center justify-between"
              >
                <p className="px-1">{t("clear")}</p>
                <div className="px-1">
                  <Delete w={11} h={12.2} color="#E92828" />
                </div>
              </button>
            </div>
          </div>
          <p className="font-light text-[14px] py-2 lg:py-0 lg:text-[16px] lg:leading-[20px] lg:font-normal text-start">
            {t("timeDec")}
          </p>
        </div>
        <Calendar
          className="w-full"
          weekDays={lang == "ar" ? weekDaysArabic : weekDaysEnglish}
          value={selectedRangeDate}
          onChange={setSelectedRangeDate}
          range={true}
          calendar={lang == "ar" ? arabic : gregorian}
          locale={lang == "ar" ? arabic_ar : gregorian_en}
        />
        <div className="px-4 pb-[20px] lg:p-0 w-full">
          <CustomButton
            title={t("confirm")}
            styleType="Primary"
            size={isMobile ? "S" : "M"}
            textColor={"text-white"}
            isDisabled={selectedRangeDate.every((element) => element === null)}
            isPointerEventsNone={selectedRangeDate.every((element) => element === null)}
            onClick={() => {
              confirm();
              setOpen(false);
            }}
            isFullWidth={true}
          />
        </div>
      </div>
    </>
  );
}
