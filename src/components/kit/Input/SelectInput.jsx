import cx from "classnames";
import Select from "react-select";
import { ArrowCircleDown } from "iconsax-react";

export default function SelectInput({
  t,
  labelText,
  icon,
  options,
  value,
  onChange,
  errorText = "",
  placeholder = t("select"),
  isMultiSelect = false,
  isSearchable = false,
  isDisable = false,
}) {
  const CustomIndicator = () => {
    return (
      <ArrowCircleDown size="20" color={!isDisable ? "#7B808C" : "#7B808CB2"} variant="Bulk" />
    );
  };
  return (
    <>
      <div className="mb-[25px] relative">
        <label className="flex items-center mb-[8px]">
          <div className="flex items-center gap-[6px]">
            {icon}
            <h5 className="titleInput text-black">{labelText}</h5>
          </div>
        </label>
        <Select
          menuPlacement="bottom"
          id="requirementSelect"
          instanceId="requirementSelect"
          placeholder={placeholder}
          options={options}
          onChange={(e) => onChange(e)}
          isMulti={isMultiSelect}
          value={value}
          isDisabled={isDisable}
          isOptionDisabled={(option) => option.disabled}
          classNames={{
            control: (state) =>
              cx(
                "w-full !rounded-lg !border-[1px] px-4 py-2 textInput text-black !ring-0",
                state.isFocused
                  ? errorText
                    ? "!border-danger"
                    : "!border-main2"
                  : errorText
                  ? "!border-danger"
                  : "!border-gray5",
                isDisable && "!bg-gray5 !border-0"
              ),
            placeholder: (state) => "!text-gray4 !m-0",
            valueContainer: (state) => "!p-0",
            option: (state) => "!px-4 !py-2 !text-black",
            indicatorSeparator: (state) => "hidden",
          }}
          components={{ IndicatorsContainer: CustomIndicator }}
          isSearchable={isSearchable}
        />
        {errorText && <p className="cta2 text-danger mt-[5px]">{errorText}</p>}
      </div>
    </>
  );
}
