import { useState } from "react";
import { Delete } from "@lib/svg";
import { useWindowSize } from "@uidotdev/usehooks";
//FUNCTION
import { isNumberKey } from "@functions/isNumberKey";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export default function Audience({ t, setOpen, audience, setAudience, isInFilter = true }) {
  const isMobile = useWindowSize().width < 960;

  const [gender, setGender] = useState(audience[0] ? audience[0] : "all");
  const [minAge, setMinAge] = useState(audience[1] && isNumber(audience[1]) ? audience[1] : null);
  const [maxAge, setMaxAge] = useState(audience[2] && isNumber(audience[2]) ? audience[2] : null);
  const [ageSectiion, setAgeSection] = useState(true);
  const [genderSectiion, setGenderSection] = useState(false);

  const array = [
    { name: t("all"), value: "all" },
    { name: t("project-profile.overView.male"), value: "Male" },
    { name: t("project-profile.overView.female"), value: "Female" },
  ];

  const confirm = () => {
    if (!isInFilter) {
      setAudience([gender, minAge, maxAge]);
      setOpen(false);
    } else {
      if (minAge || maxAge || gender !== "all") {
        setAudience([gender, minAge, maxAge]);
        setOpen(false);
      } else {
        setAudience([]);
        setOpen(false);
      }
    }
  };

  const deleteFilter = () => {
    setGender("all");
    setMaxAge("");
    setMinAge("");
    setAudience([]);
  };

  const ToggleButton = ({
    rightTab,
    setRrightTab,
    rightTabLable,
    leftTabLable,
    leftTab,
    setLeftTab,
  }) => {
    return (
      <div className="flex rounded-lg overflow-hidden mx-4 text-[14px] leading-[26px] font-semibold bg-gray5 lg:captionDesktop2 lg:leading-[26px]">
        {rightTab ? (
          <>
            <CustomButton
              title={rightTabLable}
              styleType="Primary"
              size={"S"}
              textColor={"text-white"}
              onClick={() => {
                setRrightTab(true);
                setLeftTab(false);
              }}
              isFullWidth={true}
            />
            <CustomButton
              title={leftTabLable}
              styleType="Primary"
              size={"S"}
              onClick={() => {
                setRrightTab(false);
                setLeftTab(true);
              }}
              isFullWidth={true}
              isDisabled={true}
            />
          </>
        ) : null}
        {leftTab ? (
          <>
            <CustomButton
              title={rightTabLable}
              styleType="Primary"
              size={"S"}
              onClick={() => {
                setLeftTab(false);
                setRrightTab(true);
              }}
              isFullWidth={true}
              isDisabled={true}
            />
            <CustomButton
              title={leftTabLable}
              styleType="Primary"
              size={"S"}
              textColor={"text-white"}
              onClick={() => {
                setLeftTab(true);
                setRrightTab(false);
              }}
              isFullWidth={true}
            />
          </>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <div className="pb-5 pt-2 lg:p-[25px]">
        <div className="px-4 pb-5 lg:px-0 text-black lg:pb-[24px] lg:border-b lg:border-gray5">
          <div className="flex flex-row justify-between">
            <h1 className="text-[16px] font-bold lg:text-[18px] lg:leading-[20px] lg:mb-3">
              {t("targetCommunity")}
            </h1>
            {isInFilter && (
              <div
                className={`px-4 lg:px-[30px] ${
                  gender !== "all" || minAge || maxAge ? "" : "hidden"
                }`}
              >
                <button
                  onClick={() => deleteFilter()}
                  className="py-[7px] px-3 text-danger caption4 bg-[#FCF1F1] rounded flex items-center justify-between"
                >
                  <p className="px-1">{t("clear")}</p>
                  <div className="px-1">
                    <Delete w={11} h={12.2} color="#E92828" />
                  </div>
                </button>
              </div>
            )}
          </div>
          <p className="font-light text-[14px] py-2 lg:py-0 lg:text-[16px] lg:leading-[20px] lg:font-normal">
            {t("targetCommunityDec")}
          </p>
        </div>
        <div className="lg:mt-[18px]">
          <ToggleButton
            rightTab={ageSectiion}
            setRrightTab={setAgeSection}
            rightTabLable={t("age")}
            leftTabLable={t("gender")}
            leftTab={genderSectiion}
            setLeftTab={setGenderSection}
          />
        </div>
        <div className="h-[170px] lg:h-[180px]">
          {genderSectiion ? (
            <div className="px-4 pt-[20px] pb-[29px] lg:py-[26px] lg:pb-[23px]">
              {array.map((item, index) => (
                <div
                  className={`inputTypeRadio flex items-center gap-[10px] ${
                    index === 0 ? "pt-0" : " pt-[24px] lg:pt-[22px]"
                  }`}
                  key={index}
                >
                  <input
                    id={index * 3}
                    type="radio"
                    name="item"
                    value={item.value}
                    onChange={(e) => setGender(e.target.value)}
                    checked={gender == item.value}
                    className="lg:!w-[22px] lg:!h-[22px]"
                  />
                  <label htmlFor={index * 3} className="caption1 lg:text-[18px]">
                    {item.name}
                  </label>
                </div>
              ))}
            </div>
          ) : null}
          {ageSectiion ? (
            <div>
              <div className="flex flex-row justify-center items-center w-full pt-[35px] lg:pt-[63px]">
                <input
                  maxLength="2"
                  min={0}
                  className="text-main2 underline cta2 w-[37px] h-[37px] rounded-lg outline-none text-center border border-gray5 px-0"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  onKeyDown={isNumberKey}
                  pattern="\d*"
                  inputMode="numeric"
                  onFocus={(event) => event.target.select()}
                />
                <span className="px-[14px] text-black lg:px-[45px] lg:text-[20px] lg:font-medium lg:leading-[20px]">
                  {t("until")}
                </span>
                <input
                  maxLength="2"
                  className="text-main2 underline cta2 w-[37px] h-[37px] rounded-lg outline-none text-center border border-gray5 px-0"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  onKeyDown={isNumberKey}
                  pattern="\d*"
                  inputMode="numeric"
                  onFocus={(event) => event.target.select()}
                />
              </div>
            </div>
          ) : null}
        </div>
        <div className="px-4 lg:px-0">
          <CustomButton
            title={t("confirm")}
            styleType="Primary"
            size={isMobile ? "S" : "M"}
            textColor={"text-white"}
            onClick={() => confirm()}
            isFullWidth={true}
            isDisabled={maxAge && minAge && Number(minAge) > Number(maxAge)}
            isPointerEventsNone={maxAge && minAge && Number(minAge) > Number(maxAge)}
          />
        </div>
      </div>
    </>
  );
}
