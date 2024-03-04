import { useState } from "react";
import dynamic from "next/dynamic";
import { getCookie } from "cookies-next";
import { useSelector } from "react-redux";
import { useWindowSize } from "@uidotdev/usehooks";
import { Calendar, Clock, Trash } from "iconsax-react";
//FUNCTION
import { getDate } from "@functions/getDate";
//COMPONENT
import BottomSheet from "@components/common/BottomSheet";
import CustomTransitionModal from "@components/kit/modal/CustomTransitionModal";
//COMPONENT DYNAMIC IMPORT
const CustomTimePicker = dynamic(() => import("@components/common/CustomTimePicker"), {
  ssr: false,
});
const CustomDatePicker = dynamic(() => import("@components/common/CustomDatePicker"), {
  ssr: false,
});

export default function DateTimeInputs({
  t,
  tPF,
  date,
  setDate,
  time,
  setTime,
  isRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}) {
  const size = useWindowSize();
  const lang = getCookie("NEXT_LOCALE");
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const isUser = useSelector((state) => state.isUser.isUser);

  return (
    <>
      <div className={size.width < 960 ? "" : "grid grid-cols-2 gap-[41px] mb-[50px]"}>
        <div className="mb-[25px] lg:mb-0">
          <label
            className={`flex items-center justify-start mb-[8px] lg:mb-[10px] gap-x-[6px] pointer-events-none`}
            htmlFor="calendar"
          >
            <Calendar size={18} />
            <h5 className="titleInput text-black">{isUser ? tPF("dateRUser") : tPF("dateR")}</h5>
          </label>
          <div className="relative">
            <input
              id="calendar"
              type="text"
              className="w-full rounded-lg border-[1px] h-[40px] lg:h-[52px] border-gray5 focus:shadow-none focus:outline-none focus:ring-0 py-[11px] px-[13px] textInput placeholder:text-gray4"
              placeholder={t("dateExample")}
              onClick={() => setDateOpen(true)}
              onChange={(e) => setDate(e.target.value)}
              readOnly
              value={
                isRange && startDate && endDate
                  ? `${getDate(startDate, lang)} - ${getDate(endDate, lang)}`
                  : !isRange && date
                  ? getDate(date, lang)
                  : ""
              }
              autoComplete="off"
            />
            {isRange && startDate && (
              <div
                className="absolute top-[11px] lg:top-[17px] rtl:left-[13px] ltr:right-[13px] cursor-pointer"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                <Trash color="#E53535" size={20} />
              </div>
            )}
            {!isRange && date && (
              <div
                className="absolute top-[11px] lg:top-[17px] rtl:left-[13px] ltr:right-[13px] cursor-pointer"
                onClick={() => setDate(null)}
              >
                <Trash color="#E53535" size={20} />
              </div>
            )}
          </div>
        </div>
        <div>
          <label
            className={`flex items-center justify-start gap-x-[6px] mb-[8px] lg:mb-[10px] pointer-events-none`}
            htmlFor="calendar"
          >
            <Clock size={18} />
            <h5 className="titleInput text-black">{isUser ? tPF("timeRUser") : tPF("timeR")}</h5>
          </label>
          <div className="relative">
            <input
              id="calendar"
              type="text"
              className="w-full rounded-lg border-[1px] border-gray5 h-[40px] focus:shadow-none focus:outline-none focus:ring-0 py-[11px] lg:h-[52px] px-[13px] textInput placeholder:text-gray4"
              placeholder={"09:00"}
              onClick={() => setTimeOpen(true)}
              onChange={(e) => setTime(e.target.value)}
              readOnly
              value={
                isRange && startTime && endTime
                  ? `${startTime} - ${endTime}`
                  : !isRange && time
                  ? time
                  : ""
              }
              autoComplete="off"
            />
            {isRange && startTime && (
              <div
                className="absolute top-[11px] lg:top-[17px] rtl:left-[13px] ltr:right-[13px] cursor-pointer"
                onClick={() => {
                  setStartTime(null);
                  setEndTime(null);
                }}
              >
                <Trash color="#E53535" size={20} />
              </div>
            )}
            {!isRange && time && (
              <div
                className="absolute top-[11px] lg:top-[17px] rtl:left-[13px] ltr:right-[13px] cursor-pointer"
                onClick={() => setTime(null)}
              >
                <Trash color="#E53535" size={20} />
              </div>
            )}
          </div>
        </div>
      </div>
      {size.width < 960 ? (
        <>
          <BottomSheet open={dateOpen} setOpen={setDateOpen} disableDrag={true}>
            <CustomDatePicker
              t={t}
              setDateOpen={setDateOpen}
              setDate={setDate}
              date={date}
              isRange={isRange}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </BottomSheet>
          <BottomSheet open={timeOpen} setOpen={setTimeOpen} disableDrag={true}>
            <CustomTimePicker
              t={t}
              setTimeOpen={setTimeOpen}
              setTime={setTime}
              time={time}
              isRange={isRange}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
            />
          </BottomSheet>
        </>
      ) : (
        <>
          <CustomTransitionModal open={dateOpen} close={() => setDateOpen(false)} width="400px">
            <CustomDatePicker
              t={t}
              setDateOpen={setDateOpen}
              setDate={setDate}
              date={date}
              isRange={isRange}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />
          </CustomTransitionModal>
          <CustomTransitionModal open={timeOpen} close={() => setTimeOpen(false)} width="400px">
            <CustomTimePicker
              t={t}
              setTimeOpen={setTimeOpen}
              setTime={setTime}
              time={time}
              isRange={isRange}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
            />
          </CustomTransitionModal>
        </>
      )}
    </>
  );
}
