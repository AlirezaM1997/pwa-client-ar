import { ArrowLeft } from "iconsax-react";

export default function BackButton({
  onClick,
  arrowColor = "#7B808C",
  bgColor = "bg-gray6",
  dir = "left",
  width = "w-[30px]",
  height = "h-[30px]",
  iconSize = 16,
}) {
  return (
    <>
      <div
        className={`rounded-full inline-block  ${width} ${height} flex items-center justify-center cursor-pointer ${bgColor} ${
          dir === "left" ? "" : "rotate-180"
        }`}
        onClick={onClick}
      >
        <ArrowLeft color={arrowColor} size={iconSize} />
      </div>
    </>
  );
}
