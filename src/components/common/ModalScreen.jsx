import { useEffect } from "react";
import { getCookie } from "cookies-next";

export default function ModalScreen({
  open,
  close,
  children,
  overflowY = "overflow-y-auto",
  showHeaderInDesktop = false,
}) {
  const lang = getCookie("NEXT_LOCALE");

  useEffect(() => {
    if (open) {
      showHeaderInDesktop && window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    }
  }, [open, showHeaderInDesktop]);

  return (
    <div
      className={`${open ? "block" : "hidden"} fixed w-full h-screen z-[99999] ${
        showHeaderInDesktop ? "top-[123px]" : "top-0"
      } right-0 left-0 ${overflowY} bg-white`}
      onClick={close}
    >
      <section
        className="absolute bg-white w-full h-auto 2xl:w-[1320px] 2xl:ltr:left-1/2 2xl:ltr:-translate-x-1/2 2xl:rtl:right-1/2 2xl:rtl:translate-x-1/2"
        dir={lang == "ar" ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-full ${showHeaderInDesktop ? "mb-[123px]" : ""}`}>{children}</div>
      </section>
    </div>
  );
}
