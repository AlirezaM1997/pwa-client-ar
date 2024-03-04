import { getCookie } from "cookies-next";
import { useTranslation } from "next-i18next";

export default function ToastModal(props) {
  const { t } = useTranslation();
  const lang = getCookie("NEXT_LOCALE");
  return (
    <div
      className={`${
        props.open ? "block" : "hidden"
      } fixed w-full h-screen z-[1005] backdrop-blur-[2px] top-0 right-0 bg-white`}
      onClick={props.cancel}
    >
      <section
        className="absolute bg-white h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[10px] overflow-hidden"
        dir={lang == "ar" ? "rtl" : ""}
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" px-[14px] py-4">
          <h1 className="titleInput text-center">{props.title}</h1>
        </div>
        <div className="caption3 flex items-center">
          <button
            className={`flex items-center justify-center w-full py-[10px] px-[66px] ${props.submitTextColor} ${props.submitBgColor}`}
            onClick={props.submit}
          >
            {t("ok")}
          </button>
        </div>
      </section>
    </div>
  );
}
