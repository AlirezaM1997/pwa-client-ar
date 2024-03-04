import { getCookie } from "cookies-next";
import { useWindowSize } from "@uidotdev/usehooks";
// COMPONENT
import BackButton from "@components/common/BackButton";

export default function Header({ onClick, title, hasBackButton = true, classNames = "" }) {
  const lang = getCookie("NEXT_LOCALE");
  const size = useWindowSize();

  return (
    <header
      className={`w-full flex items-center bg-white z-20 my-[23px] lg:my-[43px] min-h-[20px] lg:min-h-[40px] ${classNames}`}
    >
      {hasBackButton && (
        <div className="px-4 lg:px-[30px] z-10 flex items-center justify-between ">
          <BackButton
            onClick={onClick}
            dir={["Ar", "ar"].includes(lang) ? "right" : "left"}
            width={size.width > 960 ? "w-[36px]" : "w-[32px]"}
            height={size.width > 960 ? "h-[36px]" : "h-[32px]"}
          />
        </div>
      )}
      <p className="heading lg:titleDesktop1 absolute left-1/2 translate-x-[-50%] text-black w-max">
        {title}
      </p>
    </header>
  );
}
