export default function TextareaInput({
  value,
  setValue = (e) => null,
  onKeyDown = () => null,
  register = {}, //get for handle register name in react-hook-form
  icon,
  placeholder,
  labelText,
  isDisable = false,
  errorText = "",
  maxLength = "",
  showMaxLengthLabel = false,
  characterCount = 0,
}) {
  return (
    <>
      <div className="mb-[25px] lg:mb-0 relative">
        <label className="flex items-center mb-[8px] lg:mb-[10px]">
          <div className="flex items-center gap-[6px]">
            <div>{icon}</div>
            <h5 className="titleInput text-black">{labelText}</h5>
          </div>
        </label>
        <textarea
          rows={5}
          className={`w-full lg:h-[247px] rounded-lg border-1 border-gray5 outline-none p-[11px] textInput text-black placeholder:text-gray4 ${
            errorText ? "border-danger focus:border-danger" : "focus:border-main2"
          } ${isDisable ? "bg-gray5 border-0" : ""} focus:ring-0`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/^\s+/, ""))}
          onKeyDown={onKeyDown}
          {...register}
          maxLength={maxLength}
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
