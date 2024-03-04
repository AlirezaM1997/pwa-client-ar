import { useState, useEffect } from "react";
import Picker from "react-mobile-picker";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

function generateNumberArray(begin, end) {
  let array = [];
  for (let i = begin; i <= end; i++) {
    array.push((i < 10 ? "0" : "") + i);
  }
  return array;
}

export default function CustomTimePicker({
  t,
  time,
  setTime,
  isRange,
  setTimeOpen,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}) {
  const [selectedTime, setSelectedTime] = useState(time);
  const [selectedStartTime, setSelectedStartTime] = useState(startTime);
  const [selectedEndTime, setSelectedEndTime] = useState(endTime);

  const [timeValue, setTimeValue] = useState({
    hour: selectedTime ? selectedTime.split(":")[0] : "09",
    min: selectedTime ? selectedTime.split(":")[1] : "00",
  });

  const [startTimeValue, setStartTimeValue] = useState({
    hour: selectedStartTime ? selectedStartTime.split(":")[0] : "09",
    min: selectedStartTime ? selectedStartTime.split(":")[1] : "00",
  });

  const [endTimeValue, setEndTimeValue] = useState({
    hour: selectedEndTime ? selectedEndTime.split(":")[0] : "09",
    min: selectedEndTime ? selectedEndTime.split(":")[1] : "00",
  });

  const [optionGroups, setOptionGroups] = useState({
    hour: generateNumberArray(0, 23),
    min: generateNumberArray(0, 59),
  });

  const handleTimeChange = (name, value) => {
    setTimeValue({
      ...timeValue,
      [name]: value,
    });
  };

  const handleStartTimeChange = (name, value) => {
    setStartTimeValue({
      ...startTimeValue,
      [name]: value,
    });
  };

  const handleEndTimeChange = (name, value) => {
    setEndTimeValue({
      ...endTimeValue,
      [name]: value,
    });
  };

  useEffect(() => {
    if (isRange) {
      setSelectedStartTime(startTimeValue?.hour + ":" + startTimeValue?.min);
      setSelectedEndTime(endTimeValue?.hour + ":" + endTimeValue?.min);
    } else {
      setSelectedTime(timeValue.hour + ":" + timeValue.min);
    }
  }, [timeValue, startTimeValue, endTimeValue]);

  return (
    <>
      <div dir="ltr" className="pb-4 lg:p-5">
        {isRange ? (
          <div>
            <div>
              <p
                className={`text-[14px] text-main2 text-center leading-[24px] font-semibold lg:ctaDesktop2 lg:leading-[20px] lg:mb-[20px]`}
              >
                {t("startTime")}
              </p>
              <Picker
                optionGroups={optionGroups}
                valueGroups={startTimeValue}
                onChange={handleStartTimeChange}
                itemHeight={30}
                height={170}
              />
            </div>
            <div>
              <p
                className={`text-[14px] text-main2 text-center leading-[24px] font-semibold lg:ctaDesktop2 lg:leading-[20px] lg:mb-[20px]`}
              >
                {t("endTime")}
              </p>
              <Picker
                optionGroups={optionGroups}
                valueGroups={endTimeValue}
                onChange={handleEndTimeChange}
                itemHeight={30}
                height={170}
              />
            </div>
          </div>
        ) : (
          <Picker
            optionGroups={optionGroups}
            valueGroups={timeValue}
            onChange={handleTimeChange}
            itemHeight={30}
            height={170}
          />
        )}
        <div className="w-full px-[19px] lg:p-0">
          <CustomButton
            onClick={
              isRange
                ? () => {
                    setStartTime(selectedStartTime);
                    setEndTime(selectedEndTime);
                    setTimeOpen(false);
                  }
                : () => {
                    setTime(selectedTime);
                    setTimeOpen(false);
                  }
            }
            size="S"
            title={t("ok")}
            isFullWidth={true}
          />
        </div>
      </div>
    </>
  );
}
