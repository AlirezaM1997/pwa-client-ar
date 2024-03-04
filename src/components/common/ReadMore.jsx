import { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { useWindowSize } from "@uidotdev/usehooks";

export default function ReadMore({ text, lineCount = 3, textAlign = "" }) {
  const paragraphStyle = {
    WebkitLineClamp: lineCount,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    display: "-webkit-box",
  };

  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const ref = useRef();
  const size = useWindowSize();

  useEffect(() => {
    if (ref.current) {
      setShowReadMoreButton(ref.current.scrollHeight !== ref.current.clientHeight);
    }
  }, [size.width]);

  return (
    <div className={`caption1 text-black lg:text-[18px] lg:leading-[30px]`}>
      <p ref={ref} className={textAlign} style={isOpen ? null : paragraphStyle}>
        {text?.split("</br>").join("\n")}
      </p>

      {showReadMoreButton && (
        <button className="mr-1 ltr:ml-1 text-main2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? t("less") : t("more...")}
        </button>
      )}
    </div>
  );
}
