import { getCookie } from "cookies-next"
import { useEffect, useState } from "react"
import { MessageText } from "iconsax-react"
//FUNCTION
import { getRequirementsName } from "@functions/getRequirementsName"
//COMPONENT
import TextareaInput from "@components/kit/Input/TextareaInput"

export default function Moral({ setMoral, moral, t, isParticipation, submitMoral }) {
  const lang = getCookie("NEXT_LOCALE");
  const [description, setDescription] = useState(moral?.description);

  useEffect(() => {
    if (!moral.description) {
      setDescription("");
    }
  }, [moral]);

  useEffect(() => {
    setMoral({
      description,
      type: "MORAL",
    });
  }, [setMoral, description]);

  return (
    <>
      <div className="">
        {!isParticipation && (
          <div className="pb-[20px]">
            <h1 className="heading">{getRequirementsName("moral", lang)}</h1>
          </div>
        )}

        <TextareaInput
          t={t}
          value={description}
          setValue={setDescription}
          labelText={t("description")}
          icon={<MessageText size={16} />}
          maxLength={500}
          showMaxLengthLabel={true}
          characterCount={description?.length}
          placeholder={t("requirePlaceholdDesc.moralPlacehold")}
        />
      </div>
    </>
  );
}
