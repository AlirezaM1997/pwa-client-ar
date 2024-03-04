import { useEffect } from "react";

export default function CustomModalScreen({
  open,
  cancelOnClick,
  children,
  sectionFromTop = "top-0",
  positionClass = "",
  bg = "bg-[#31313133]",
}) {
  
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  return (
    <div
      className={`${open ? "block" : "hidden"} fixed w-full h-screen z-[99999] top-0 right-0`}
      onClick={cancelOnClick}
    >
      <section className={`absolute ${sectionFromTop} bottom-0 right-0 w-full ${bg}`}>
        <div
          className={`bg-white absolute ${positionClass} border border-gray7 rounded-lg max-h-full overflow-auto `}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </section>
    </div>
  );
}
