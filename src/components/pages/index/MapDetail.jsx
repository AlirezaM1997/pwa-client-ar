import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
// FUNCTION
import { moneyFormatter } from "@functions/moneyFormatter";

function MapDetail({ iconElement, moneyFormatterValue, text }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center lg:items-start gap-x-[18px] mb-4 lg:mb-0">
      <div className=" shadow-[0px_2px_10px_0px_#7c8db51f] rounded-lg flex justify-center items-center w-[38px] h-[38px] lg:w-[44px] lg:h-[44px]">
        {iconElement}
      </div>
      <div>
        <p className="heading lg:text-[28px] lg:font-semibold lg:leading-[40px]">
          {moneyFormatter(moneyFormatterValue)}
        </p>
        <p className="caption1 lg:text-[16px] lg:font-medium lg:leading-[30px]">{text}</p>
      </div>
    </div>
  );
}
MapDetail.propTypes = {
  iconElement: PropTypes.elementType,
  moneyFormatterValue: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};
MapDetail.defaultProps = {
  iconElement: null,
};
export default MapDetail;
