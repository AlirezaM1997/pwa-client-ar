import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useWindowSize } from "@uidotdev/usehooks";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

export default function Sort({ setOpenSort, t }) {
  const router = useRouter();
  const size = useWindowSize();
  const isMobile = size.width < 960;
  const [sortItems, setSortItems] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (router.query.source === "project") {
      setSortItems([
        { label: t("popularity"), value: "MOST_VISIT_COUNT" },
        { label: t("participationCount"), value: "MOST_PARTICIPATED" },
        { label: t("last"), value: "LATEST" },
      ]);
    } else if (router.query.source === "request") {
      setSortItems([
        { label: t("popularity"), value: "MOST_VISIT_COUNT" },
        { label: t("last"), value: "LATEST" },
      ]);
    } else if (router.query.source === "collections") {
      setSortItems([
        {
          label: t("mostProjectsCounts"),
          value: "HIGHEST_PROJECT_COUNTS",
        },
        { label: t("mostScore"), value: "HIGHEST_SCORE" },
        { label: t("mostFollowers"), value: "MOST_FOLLOWER_COUNTS" },
      ]);
    }

    if (router.query.sort) {
      setSelectedItem(router.query.sort);
    }
  }, [router.query]);

  const onOptionChange = (e) => {
    setSelectedItem(e.target.value);
  };

  const handleClickButton = () => {
    router.query.sort = selectedItem;
    router.push(router, undefined, { shallow: true });
    setOpenSort(false);
  };

  return (
    <div className="flex flex-col px-4 pb-3 lg:p-[25px]">
      <div className=" lg:border-b lg:border-gray5">
        <p className="text-[16px] font-bold lg:text-[18px] lg:leading-[20px]">{t("grouping")}</p>
        <p className="mt-3 text-black leading-[16px] text-[14px] font-normal lg:leading-[20px]">
          {t("sortDec")}
        </p>
        <div className={`flex flex-col mt-3 mb-4 lg:mt-[19px] lg:mb-0`}>
          {sortItems?.map((item, index) => {
            return (
              <div className={`flex py-[8px] lg:pb-[24px] lg:pt-0  inputTypeRadio`} key={index}>
                <input
                  type="radio"
                  name="input"
                  value={item.value}
                  id="radio"
                  checked={selectedItem === item.value}
                  onChange={onOptionChange}
                  className="w-5 h-8 mt-1"
                />
                <p className="px-2 text-[16px] font-normal lg:text-[16px]  text-gray1">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <CustomButton
        title={t("showResult")}
        styleType="Primary"
        size={isMobile ? "S" : "M"}
        textColor={"text-white"}
        onClick={() => handleClickButton()}
        isFullWidth={true}
      />
    </div>
  );
}
