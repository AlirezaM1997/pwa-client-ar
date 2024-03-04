import { useState } from "react";
import { useTranslation } from "next-i18next";

export default function ShowMoreText({
  text,
  length,
  textAlign = "",
  wrapperTextAlign = "text-center",
  classNames = "",
}) {
  
  const { t } = useTranslation();
  const [showMoreDescription, setShowMoreDescription] = useState(false);

  return (
    <div
      className={`${wrapperTextAlign} caption1 text-black lg:text-[18px] lg:leading-[30px] whitespace-pre-wrap ${classNames}`}
      style={{ wordBreak: "break-word" }}
    >
      <p className={textAlign}>
        {showMoreDescription
          ? text.split("</br>").join("\n")
          : text?.slice(0, length).split("</br>").join("\n")}
      </p>
      {text?.length > length ? (
        <button
          className="mr-1 ltr:ml-1 text-main2"
          onClick={() => setShowMoreDescription(!showMoreDescription)}
        >
          {!showMoreDescription ? t("more...") : t("less")}
        </button>
      ) : null}
    </div>
  );
}
