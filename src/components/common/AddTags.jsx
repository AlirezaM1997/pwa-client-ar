import { CloseCircle } from "iconsax-react";
import { useEffect, useState } from "react";
//COMPONENT
import PlainInput from "@components/kit/Input/PlainInput";
import CustomButton from "@components/kit/button/CustomButton";

const AddTags = ({ tags = [], setTags, openModalTag, tPF, t }) => {
  const [value, setValue] = useState("");

  const addTag = () => {
    if (value && tags.length < 10) {
      setTags([...tags, value]);
      setValue("");
    }
  };

  const deleteTag = (deletedIndex) => {
    setTags(tags.filter((item, index) => index !== deletedIndex));
  };

  useEffect(() => {
    if (!openModalTag) {
      setValue("");
    }
  }, [openModalTag]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      addTag();
    }
  };

  return (
    <div className="px-4 lg:p-[25px] mt-[10px] lg:mt-30px">
      <h5 className="mb-[9px] titleInput text-black">{tPF("write the tags you want")}</h5>
      <div className="min-h-[188px]">
        <div className="grid grid-cols-[auto_85px] items-center gap-1">
          <PlainInput
            value={value}
            setValue={setValue}
            maxLength={25}
            hasMarginBottom={false}
            onKeyDown={handleKeyDown}
            isDisabled={tags.length >= 10}
          />

          <CustomButton
            onClick={addTag}
            title={t("confirm")}
            size="S"
            width="85px"
            isDisabled={!value || tags.length >= 10}
          />
          <p
            style={{
              textAlign: "left",
              width: "  100%",
              paddingTop: "5px",
              fontSize: "12px",
              color: "gray",
            }}
          >{`${value.length}/${25} `}</p>
        </div>

        <div className="flex gap-1 flex-wrap mb-[125px]">
          {tags.map((item, index) => (
            <span
              key={index + "tags"}
              className={`flex items-center mt-[10px] bg-gray5 border-[1px] border-gray5 rounded p-[6px] gap-x-1 w-fit`}
            >
              <button
                className="rounded-full w-[14px] h-[14px] flex justify-center items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTag(index);
                }}
              >
                <CloseCircle color="#CB3A31" size={15} />
              </button>
              <p className="caption4">{item}</p>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddTags;
