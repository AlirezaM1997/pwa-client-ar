import { getCookie } from "cookies-next";
import { MessageText } from "iconsax-react";
import { useEffect, useState } from "react";
//FUNCTION
import { getRequirementsName } from "@functions/getRequirementsName";
//COMPONENT
import TextareaInput from "@components/kit/Input/TextareaInput";

export default function Capacity({ setCapacity, capacity, t, isParticipation, submitCapacity }) {
  const lang = getCookie("NEXT_LOCALE");
  const [description, setDescription] = useState(capacity?.description);

  useEffect(() => {
    if (!capacity.description) {
      setDescription("");
    }
  }, [capacity]);

  useEffect(() => {
    setCapacity({
      description,
      type: "CAPACITY",
    });
  }, [setCapacity, description]);

  return (
    <>
      <div className="">
        {!isParticipation && (
          <div className="pb-[20px]">
            <h1 className="heading">{getRequirementsName("capacity", lang)}</h1>
            {/* <p className="text-[14px] leading-[26px] font-normal pt-[2px] text-gray4">{t("choseSubjects.dCapacity")}</p> */}
          </div>
        )}
        <TextareaInput
          t={t}
          value={description}
          setValue={setDescription}
          // errorText={t("errorMessages.requiredField")}
          maxLength={500}
          labelText={t("description")}
          icon={<MessageText size={16} />}
          showMaxLengthLabel={true}
          characterCount={description?.length}
          placeholder={t("requirePlaceholdDesc.capacityPlacehold")}
        />
      </div>
    </>
  );
}
