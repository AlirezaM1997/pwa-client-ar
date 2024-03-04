import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { MessageText } from "iconsax-react";
//FUNCTION
import { getRequirementsName } from "@functions/getRequirementsName";
//COMPONENT
import TextareaInput from "@components/kit/Input/TextareaInput";

export default function Skill({ t, setSkill, skill, isParticipation, submitSkill }) {
  const lang = getCookie("NEXT_LOCALE");
  const [description, setDescription] = useState(skill?.description);

  useEffect(() => {
    if (!skill.description) {
      setDescription("");
    }
  }, [skill]);

  useEffect(() => {
    setSkill({
      description,
      type: "SKILL",
    });
  }, [setSkill, description]);

  return (
    <>
      <div className="">
        {!isParticipation && (
          <div className="pb-[20px]">
            <h1 className="heading">{getRequirementsName("skill", lang)}</h1>
          </div>
        )}
        <TextareaInput
          t={t}
          value={description}
          setValue={setDescription}
          maxLength={500}
          showMaxLengthLabel={true}
          characterCount={description?.length}
          labelText={t("description")}
          icon={<MessageText size={16} />}
          placeholder={t("requirePlaceholdDesc.skillPlacehold")}
        />
      </div>
    </>
  );
}
