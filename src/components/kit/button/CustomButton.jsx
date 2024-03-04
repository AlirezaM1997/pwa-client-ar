export default function CustomButton({
  type = "button", // type of button: one of : button, submit, reset
  styleType = "Primary",
  size = "X",
  paddingX = "p-2",
  title = "",
  icon = null,
  bgColor = "bg-main2",
  borderColor = "border-main2",
  textColor = "text-[#FFFFFF]",
  isFullWidth = false,
  width = "", // should be set base on tailwind width: w-[118px] or w-2
  isDisabled = false,
  onClick = () => null,
  isIconLeftSide = true,
  isPointerEventsNone = false,
  id = "",
  classNames=""
}) {
  const lookupType = {
    Primary: `${isDisabled ? "bg-gray5" : bgColor} ${isDisabled ? "text-gray4" : textColor}`,
    Secondary: `border-[1px] bg-transparent ${isDisabled ? "border-gray4" : borderColor} ${
      isDisabled ? "text-gray4" : textColor
    }`,
    Tertiary: `${isDisabled ? "text-gray4" : textColor}`,
  };

  const lookupSize = {
    X: `h-[34px]`,
    XS: `h-[36px]`,
    S: `h-[40px]`,
    M: `h-[48px]`,
  };

  return (
    <button
      className={`rounded-lg flex ${isPointerEventsNone ? "pointer-events-none" : ""} ${
        isIconLeftSide ? "ltr:flex-row rtl:flex-row-reverse" : "ltr:flex-row-reverse rtl:flex-row"
      } items-center justify-center  ${isFullWidth ? "w-full" : width} ${lookupType[styleType]} ${
        lookupSize[size]
      } ${paddingX} ${classNames}`}
      id={id}
      onClick={onClick}
      type={type}
    >
      <div
        className={`${icon && title !== "" && !isIconLeftSide && "ml-[11px]"} ${
          icon && title !== "" && isIconLeftSide && "mr-[11px]"
        }`}
      >
        {icon}
      </div>
      <h6 className="text-[14px] leading-[16px] font-bold ">{title}</h6>
    </button>
  );
}
