import { Delete } from "@lib/svg";
import { useState } from "react";
import { WhiteStar, YellowStar } from "@lib/svg";
import { useWindowSize } from "@uidotdev/usehooks";
import StarRatingComponent from "react-star-rating-component";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";

export default function Score({ setOpen, t, score, setScore }) {
  const isMobile = useWindowSize().width < 960;
  const [fromScore, setFromScore] = useState(score[0] ? score[0] : null);
  const [untilScore, setUntilScore] = useState(score[1] ? score[1] : null);

  const confirm = () => {
    if (fromScore || untilScore) {
      setScore([fromScore ? fromScore : null, untilScore ? untilScore : null]);
    } else {
      setScore([]);
    }
  };

  const deleteFilter = () => {
    setFromScore(null);
    setUntilScore(null);
    setScore([]);
  };

  return (
    <div className="lg:p-[25px]">
      <div className="px-[14px] lg:px-0 text-black lg:pb-[24px] lg:border-b lg:border-gray5">
        <div className="flex flex-row justify-between">
          <h1 className="text-[16px] font-bold lg:text-[18px] lg:leading-[20px] lg:mb-3">
            {t("score")}
          </h1>
          <div className={`px-4 lg:px-[30px] ${score.length === 0 ? "hidden" : ""}`}>
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
        </div>
        <p className="font-light text-[14px] py-2 lg:py-0 lg:text-[16px] lg:leading-[20px] lg:font-normal">
          {t("scoreDec")}
        </p>
      </div>

      <div className="flex items-center justify-center gap-[21px] py-4 px-4 mb-5 mt-[5px] lg:justify-start lg:gap-[41px] lg:py-0 lg:px-0 lg:mt-[15px] lg:mb-[40px]">
        <span className="text-[13px] leading-[20px] font-normal lg:text-[18px] lg:leading-[20px] ">
          {t("from")}
        </span>
        <StarRatingComponent
          name="rate1"
          value={fromScore}
          onStarClick={(e) => setFromScore(e)}
          className="!flex flex-row-reverse gap-[2px] lg:gap-[28px]"
          renderStarIcon={(index) => {
            return (
              <>
                {index <= fromScore ? (
                  <YellowStar w={isMobile ? 23 : 41} />
                ) : (
                  <WhiteStar w={isMobile ? 23 : 41} />
                )}
              </>
            );
          }}
        />
      </div>
      <div className="flex items-center justify-center gap-[21px] py-4 px-4 mb-[10px] lg:gap-[41px] lg:justify-start lg:py-0 lg:px-0 lg:mb-[26px]">
        <span className="text-[13px] leading-[20px] font-normal lg:text-[18px] lg:leading-[20px] ">
          {t("until")}
        </span>
        <StarRatingComponent
          name="rate1"
          value={untilScore}
          onStarClick={(e) => setUntilScore(e)}
          className="!flex flex-row-reverse gap-[2px] lg:gap-[28px]"
          renderStarIcon={(index) => {
            return (
              <>
                {index <= untilScore ? (
                  <YellowStar w={isMobile ? 23 : 41} />
                ) : (
                  <WhiteStar w={isMobile ? 23 : 41} />
                )}
              </>
            );
          }}
        />
      </div>
      <div className="px-4 pb-[20px] lg:p-0">
        <CustomButton
          title={t("confirm")}
          isDisabled={fromScore > untilScore && untilScore ? true : false}
          isPointerEventsNone={fromScore > untilScore && untilScore ? true : false}
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
