import { getCookie } from "cookies-next";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

export default function ColumnList({ items = [] }) {
  const lang = getCookie("NEXT_LOCALE");

  return (
    <>
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-center justify-between py-4 cursor-pointer ${
            index + 1 === items.length ? "" : "border-b-[1px] border-gray6"
          } ${item?.isDisable ? "pointer-events-none text-gray4" : ""}`}
          onClick={item.onClick}
        >
          <div className="flex items-center">
            <div>{item.icon}</div>
            <p className="px-[10px] title1 lg:text-[16px] lg:font-bold">{item.label}</p>
          </div>
          <div>{lang == "ar" ? <ArrowLeft2 size={20} /> : <ArrowRight2 size={20} />}</div>
        </div>
      ))}
    </>
  );
}
