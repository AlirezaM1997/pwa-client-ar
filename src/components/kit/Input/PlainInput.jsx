import { getCookie } from "cookies-next";

export default function PlainInput({
  value,
  setValue = (e) => null,
  register = {}, //get for handle register name in react-hook-form
  labelText = "",
  icon = null,
  placeholder,
  errorText = "",
  isDisable = false,
  maxLength = "",
  showMaxLengthLabel = false,
  characterCount = 0,
  hasMarginBottom = true,
  onKeyDown = () => null,
  onChange = null,
  inputDir = null,
  type = "text",
  ...attributes
}) {
  const lang = getCookie("NEXT_LOCALE");

  return (
    <>
      <div className={`${hasMarginBottom ? "mb-[25px] lg:mb-[41px]" : ""} relative`}>
        <label
          className={`flex items-center ${
            icon || labelText !== "" ? "mb-[8px] lg:mb-[10px]" : ""
          } `}
        >
          <div className="flex items-center gap-[6px]">
            {icon}
            <h5 className="titleInput text-black">{labelText}</h5>
          </div>
        </label>
        <input
          value={value}
          dir={inputDir ? inputDir : lang == "ar" ? "rtl" : "ltr"}
          onChange={onChange ? onChange : (e) => setValue(e.target.value.replace(/^\s+/, ""))}
          type={type}
          className={`w-full rounded-lg border-1 border-gray5 py-2 lg:py-[14px] px-4 textInput text-black placeholder:text-gray4 ${
            isDisable ? "bg-gray5 border-0" : ""
          } ${errorText ? "border-danger focus:border-danger" : "focus:border-main2"} focus:ring-0`}
          placeholder={placeholder}
          autoComplete="off"
          disabled={isDisable}
          {...register}
          maxLength={maxLength}
          onKeyDown={onKeyDown}
          {...attributes}
        />
        {showMaxLengthLabel && maxLength && (
          <div className="flex flex-row-reverse mt-[5px] items-center justify-between">
            <span
              className={`cta2 lg:caption3 text-gray4 ${errorText ? "text-danger" : ""}`}
            >{`${characterCount}/${maxLength}`}</span>
            {errorText && <p className="cta2 lg:caption3 text-danger">{errorText}</p>}
          </div>
        )}
      </div>
    </>
  );
}
