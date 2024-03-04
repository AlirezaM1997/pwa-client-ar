import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { exceptThisSymbols } from "@constants/index";
//FUNCTION
import numberToEnglish from "@functions/numberToEnglish";
import { moneyFormatter } from "@functions/moneyFormatter";
import { removeNonNumeric } from "@functions/removeNonNumeric";
import { getRequirementsName } from "@functions/getRequirementsName";
import numToArabic from "@functions/numToArabic";

export default function Financial({ setFinancial, financial, t, submitFinancial }) {
  const lang = getCookie("NEXT_LOCALE");
  const [value, setValue] = useState(financial?.amount ?? null);
  const [textValue, setTextValue] = useState(moneyFormatter(financial?.amount));

  const handleChange = (event) => {
    const readableValue = moneyFormatter(removeNonNumeric(event.target.value.replace(/^0/, "")));
    setTextValue(readableValue);
    setValue(Number(readableValue.replace(/,/g, "")));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      if (!financial.amount || financial.amount < 10000 || financial.amount > 10000000000) {
        return null;
      } else {
        submitFinancial();
      }
    }
  };

  useEffect(() => {
    setFinancial({ amount: value });
  }, [value, setFinancial]);

  return (
    <>
      <div className="">
        <div className="pb-[20px]">
          <h1 className="heading">{getRequirementsName("financial", lang)}</h1>
        </div>
        <h1 className="text-[12px] leading-[26px] font-normal pb-2 text-center">
          {t("requirementPicker.enterTheAmount")}
        </h1>
        <div className="relative">
          <label
            className="placeholder absolute top-[23%] rtl:left-2 ltr:right-2 text-[#8D8D8D]"
            htmlFor="input"
          >
            {t("toman")}
          </label>
          <input
            id="input"
            dir="ltr"
            className="rounded-lg border-[1px] border-gray5 w-full py-[9px] rtl:pl-[50px] ltr:pr-[50px] ltr:placeholder:text-left rtl:placeholder:text-right placeholder:text-gray2 placeholder:text-[12px] outline-none focus:border-gray5 focus:ring-0"
            type="text"
            maxLength={14}
            autoComplete="off"
            value={textValue}
            onChange={handleChange}
            onKeyDown={(e) => {
              exceptThisSymbols.includes(e.key) && e.preventDefault();
              handleKeyDown(e);
            }}
            pattern="\d*"
            inputMode="numeric"
          />
        </div>

        {value || financial?.amount ? (
          <div className="flex items-center justify-center mt-3">
            <p className="pl-1 ltr:pr-1 text-[10px] leading-[20px] font-normal text-gray4">
              {lang === "en"
                ? numberToEnglish(value || financial?.amount)
                : numToArabic(value || financial?.amount)}
            </p>
            <p className="text-[10px] leading-[20px] font-normal text-gray4">{t("toman")}</p>
          </div>
        ) : null}
      </div>
    </>
  );
}
