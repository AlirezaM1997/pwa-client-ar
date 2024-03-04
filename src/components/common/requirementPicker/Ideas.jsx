import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { MessageText } from "iconsax-react";
//FUNCTION
import { getRequirementsName } from "@functions/getRequirementsName";
//COMPONENT
import TextareaInput from "@components/kit/Input/TextareaInput";

export default function Ideas({ setIdeas, ideas, t, isParticipation, ideasError, submitIdeas }) {
  const lang = getCookie("NEXT_LOCALE");
  const [description, setDescription] = useState(ideas?.description);

  useEffect(() => {
    if (!ideas.description) {
      setDescription("");
    }
  }, [ideas]);

  useEffect(() => {
    setIdeas({
      type: "IDEAS",
      description,
    });
  }, [setIdeas, description]);

  return (
    <>
      <div className="">
        {!isParticipation && (
          <div className="pb-[20px]">
            <h1 className="heading">{getRequirementsName("ideas", lang)}</h1>
          </div>
        )}
        <TextareaInput
          t={t}
          value={description}
          setValue={setDescription}
          errorText={ideasError ? t("errorMessages.requiredField") : ""}
          maxLength={500}
          labelText={t("description")}
          icon={<MessageText size={16} />}
          characterCount={description?.length}
          showMaxLengthLabel={true}
          placeholder={t("requirePlaceholdDesc.ideasPlacehold")}
        />
      </div>
    </>
  );
}
