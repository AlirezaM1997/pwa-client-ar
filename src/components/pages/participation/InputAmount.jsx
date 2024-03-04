import { useEffect, useState } from "react";
import { exceptThisSymbols } from "@constants/index";
// FUNCTION
import { moneyFormatter } from "@functions/moneyFormatter";
import { toEnglishDigits } from "@functions/toEnglishDigits";
import { removeNonNumeric } from "@functions/removeNonNumeric";
// COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

const lookup = {
  1: 10000,
  2: 50000,
  3: 100000,
  4: 1000000,
};
export default function InputAmount({
  t,
  tPA,
  setSelectedItem,
  setValue,
  setTextValue,
  selectedItem,
  value,
  setOpenInputAmountBottomSheet,
  setAmount,
  textValue,
}) {
  const [minimumMoneyError, setMinimumMoneyError] = useState(false);
  const [maximumMoneyError, setMaximumMoneyError] = useState(false);
  useEffect(() => {
    if (minimumMoneyError) {
      if (value < 1) {
        setMinimumMoneyError(true);
      } else {
        setMinimumMoneyError(false);
      }
    }
  }, [minimumMoneyError, value]);
  const handleChange = (event) => {
    setTextValue(moneyFormatter(removeNonNumeric(event.target.value.replace(/^0/, ""))));
    setValue(Number(event.target.value.replace(/,/g, "")));
  };
  const _continue = () => {
    if (value) {
      if (value >= 10000 && value <= 100000000) {
        setAmount(value);
        setOpenInputAmountBottomSheet(false);
        setMinimumMoneyError(false);
        setMaximumMoneyError(false);
      } else {
        if (value >= 100000000) {
          setMaximumMoneyError(true);
        } else {
          setMinimumMoneyError(true);
        }
      }
    } else {
      const result = lookup[selectedItem];
      setAmount(result);
      setOpenInputAmountBottomSheet(false);
    }
  };
  return (
    <>
      <div className="pb-6 px-4 lg:p-[25px]">
        <h1 className="titleInput lg:text-[18px] lg:font-bold lg:leading-[40px] text-center mb-9 lg:mb-6">
          {tPA("howMuchDonate")}
        </h1>
        <div className="grid grid-cols-2 gap-3 title4 lg:text-[20px] lg:font-medium lg:leading-[40px]">
          <div
            onClick={() => {
              setSelectedItem(1);
              setValue("10000");
              setTextValue(moneyFormatter("10000"));
            }}
            className={` ${
              (selectedItem === 1 && value == "10000") || value == "10000"
                ? "bg-main2 text-white"
                : ""
            } flex items-center justify-center border-[1px] border-gray5 rounded-lg py-6 cursor-pointer`}
          >
            <div className="mr-3 ml-1 ltr:ml-3 ltr:mr-1">
              {moneyFormatter(toEnglishDigits("10000"))}
            </div>
            <p>{t("toman")}</p>
          </div>
          <div
            onClick={() => {
              setSelectedItem(2);
              setValue("50000");
              setTextValue(moneyFormatter("50000"));
            }}
            className={` ${
              (selectedItem === 2 && value == "50000") || value == "50000"
                ? "bg-main2 text-white"
                : ""
            } flex items-center justify-center border-[1px] border-gray5 rounded-lg py-6 cursor-pointer`}
          >
            <div className="mr-3 ml-1 ltr:ml-3 ltr:mr-1">{moneyFormatter(50000)}</div>
            <p>{t("toman")}</p>
          </div>
          <div
            onClick={() => {
              setSelectedItem(3);
              setValue("100000");
              setTextValue(moneyFormatter("100000"));
            }}
            className={` ${
              (selectedItem === 3 && value == "100000") || value == "100000"
                ? "bg-main2 text-white"
                : ""
            } flex items-center justify-center border-[1px] border-gray5 rounded-lg py-6 cursor-pointer`}
          >
            <div className="mr-3 ml-1 ltr:ml-3 ltr:mr-1">{moneyFormatter(100000)}</div>
            <p>{t("toman")}</p>
          </div>
          <div
            onClick={() => {
              setSelectedItem(4);
              setValue("1000000");
              setTextValue(moneyFormatter("1000000"));
            }}
            className={` ${
              (selectedItem === 4 && value == "1000000") || value == "1000000"
                ? "bg-main2 text-white"
                : ""
            } flex items-center justify-center border-[1px] border-gray5 rounded-lg py-6 cursor-pointer`}
          >
            <div className="mr-3 ml-1 ltr:ml-3 ltr:mr-1">{moneyFormatter(1000000)}</div>
            <p>{t("toman")}</p>
          </div>
        </div>
        <div className="flex justify-center items-center my-[30px]">
          <div className="h-[1px] bg-gray5 w-full"></div>
          <h1 className="text-center  text-gray5 px-4 lg:text-[16px] lg:font-semibold lg:leading-[20px]">
            {t("or")}
          </h1>
          <div className="h-[1px] bg-gray5 w-full"></div>
        </div>
        <label className="title1 lg:text-[14px] lg:font-semibold lg:leading-[22px] pb-1 lg:pb-2">
          {tPA("amountDonation")}
        </label>
        <div className=" relative mt-1 lg:mt-2">
          <input
            id="__amount"
            type="text"
            maxLength={11}
            className={`${
              value !== "" && selectedItem ? "bg-white border-[1px]" : "bg-gray6"
            } w-full rounded-lg  outline-none py-[14px] text-center lg:text-[16px] lg:font-normal lg:leading-[32px] placeholder:text-gray7 placeholder:text-[14px] placeholder:font-medium `}
            placeholder={tPA("importDonationAmount")}
            onChange={handleChange}
            onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()}
            autoComplete="off"
            value={textValue}
            pattern="\d*"
            inputMode="numeric"
          />
          {selectedItem && (
            <span className="heading text-[#A2A9B4] absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2">
              {t("toman")}
            </span>
          )}
          {value !== "" && (
            <span className="heading absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2">
              {t("toman")}
            </span>
          )}
        </div>
        {minimumMoneyError && (
          <p className=" text-danger text-center caption3 mt-2">
            {tPA("minimumParticipationAmount")}
          </p>
        )}
        {maximumMoneyError && (
          <p className=" text-danger text-center caption3 mt-2">
            {tPA("maximumParticipationAmount")}
          </p>
        )}
        <div className="mt-[50px]">
          <CustomButton
            title={t("continue")}
            onClick={() => _continue()}
            isFullWidth={true}
            size="M"
            isDisabled={!value || value < 10000 || value > 100000000}
            isPointerEventsNone={!value || value < 10000 || value > 100000000}
          />
        </div>
      </div>
    </>
  );
}
