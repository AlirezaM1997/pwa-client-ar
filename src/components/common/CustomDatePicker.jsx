import { useState } from "react";
import { getCookie } from "cookies-next";
import { Calendar as CalendarIconSax } from "iconsax-react";
import arabic from "react-date-object/calendars/arabic"
import arabic_ar from "react-date-object/locales/arabic_ar"
import gregorian from "react-date-object/calendars/gregorian";
import { Calendar } from "react-multi-date-picker";
import gregorian_en from "react-date-object/locales/gregorian_en";
//FUNCTION
import { getDate } from "@functions/getDate";
import { weekDaysEnglish, weekDaysArabic } from "@constants/index";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

export default function CustomDatePicker({
  t,
  date,
  setDate,
  isRange,
  setDateOpen,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  const lang = getCookie("NEXT_LOCALE");
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedRangeDate, setSelectedRangeDate] = useState([startDate, endDate]);

  const handleIsDisabled = () => {
    if (isRange) {
      if (selectedRangeDate[0] && selectedRangeDate[1]) {
        return false;
      } else {
        return true;
      }
    } else {
      if (selectedDate) {
        return false;
      } else {
        return true;
      }
    }
  };

  const handleConfirm = () => {
    if (isRange) {
      setStartDate(selectedRangeDate[0]);
      setEndDate(selectedRangeDate[1]);
      setDateOpen(false);
    } else {
      setDate(selectedDate);
      setDateOpen(false);
    }
  };

  return (
    <>
      <div className="pb-4 lg:p-5">
        {isRange ? (
          <div className="flex items-center justify-center gap-x-3">
            <div
              className={`flex items-center justify-between rounded-[10px] border-[1px] ${
                selectedRangeDate[0] ? "border-main3" : "border-gray4"
              } px-[14px] py-[10px] w-[148px]`}
            >
              <div>
                <CalendarIconSax
                  color={selectedRangeDate[0] ? "#56C3E0" : "#727272"}
                  variant="Bulk"
                />
              </div>
              <p className="titleInput">
                {selectedRangeDate[0] && getDate(selectedRangeDate[0], lang)}
              </p>
            </div>
            <div
              className={`flex items-center justify-between rounded-[10px] border-[1px] ${
                selectedRangeDate[1] ? "border-main3" : "border-gray4"
              } px-[14px] py-[10px] w-[148px]`}
            >
              <div>
                <CalendarIconSax
                  color={selectedRangeDate[1] ? "#56C3E0" : "#727272"}
                  variant="Bulk"
                />
              </div>
              <p className="titleInput">
                {selectedRangeDate[1] && getDate(selectedRangeDate[1], lang)}
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`mx-auto flex items-center justify-between rounded-[10px] border-[1px] ${
              selectedDate ? "border-main3" : "border-gray4"
            } px-[14px] py-[10px] w-[148px]`}
          >
            <div>
              <CalendarIconSax color={selectedDate ? "#56C3E0" : "#727272"} variant="Bulk" />
            </div>
            <p className="titleInput">{selectedDate && getDate(selectedDate, lang)}</p>
          </div>
        )}
        <div className="flex justify-center px-6 lg:px-0">
          <Calendar
            className="w-full"
            weekDays={lang == "ar" ? weekDaysArabic : weekDaysEnglish}
            value={isRange ? selectedRangeDate : selectedDate}
            onChange={isRange ? (e) => setSelectedRangeDate(e) : (e) => setSelectedDate(e)}
            range={isRange}
            calendar={lang == "ar" ? arabic : gregorian}
            locale={lang == "ar" ? arabic_ar : gregorian_en}
          />
        </div>
        <div className="w-full px-[19px] lg:px-0">
          <CustomButton
            onClick={handleConfirm}
            size="S"
            title={t("ok")}
            isFullWidth={true}
            isDisabled={handleIsDisabled()}
            isPointerEventsNone={handleIsDisabled()}
          />
        </div>
      </div>
    </>
  );
}
