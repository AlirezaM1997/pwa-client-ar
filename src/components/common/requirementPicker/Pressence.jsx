import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { MessageText } from "iconsax-react";
//FUNCTION
import { getRequirementsName } from "@functions/getRequirementsName";
//COMPONENT
import TextareaInput from "@components/kit/Input/TextareaInput";

export default function Pressence({ setPressence, pressence, t, submitPressence }) {
  const lang = getCookie("NEXT_LOCALE");
  const [description, setDescription] = useState(pressence?.description);

  useEffect(() => {
    setPressence({ description });
  }, [description]);

  return (
    <>
      <div className="">
        <div className="pb-[30px]">
          <h1 className="heading">{getRequirementsName("pressence", lang)}</h1>
        </div>
        <TextareaInput
          t={t}
          value={description}
          setValue={setDescription}
          maxLength={500}
          characterCount={description?.length}
          showMaxLengthLabel={true}
          labelText={t("description")}
          icon={<MessageText size={16} />}
          placeholder={t("requirePlaceholdDesc.pressencePlacehold")}
        />
      </div>
    </>
  );
}
