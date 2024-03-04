import { useRouter } from "next/router";
import { SearchNormal } from "iconsax-react";
import { useTranslation } from "react-i18next";

export default function SearchInput({
  icon = null,
  isIconLeft,
  value,
  setValue,
  buttonOnClick,
  pathname = "/search",
  query = null,
}) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleKeyDown = (e) => {
    document.body.style.overflow = "unset";
    if (e.key === "Enter" || e.keyCode === 13) {
      router.push(
        {
          pathname: pathname,
          query,
        },
        undefined,
        { shallow: true }
      );
    }
  };

  return (
    <>
      <div
        className={` ${icon ? "grid" : "flex"} ${
          isIconLeft ? "grid-cols-[32px_auto]" : "grid-cols-[auto_32px]"
        }  items-center w-full ${icon ? "gap-x-2" : ""} `}
      >
        <div className={`relative w-full ${isIconLeft ? " order-2" : ""}`}>
          <input
            className={`w-full rounded-[17px] bg-gray6 py-2 caption3 leading-[18px] px-[14px] outline-none`}
            placeholder={t("search")}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={query ? handleKeyDown : () => null}
          />
          <div className={`absolute ltr:right-5 rtl:left-5 top-1/2 -translate-y-1/2`}>
            <SearchNormal size={16} color="#7B808C" />
          </div>
        </div>
        {icon && (
          <button
            className={`bg-gray6 w-8 h-8 rounded-full relative flex items-center justify-center `}
            onClick={buttonOnClick}
          >
            {icon}
          </button>
        )}
      </div>
    </>
  );
}
