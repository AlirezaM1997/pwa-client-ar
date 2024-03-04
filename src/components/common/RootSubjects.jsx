import { useState } from "react";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { getCookie } from "cookies-next";
import { useWindowSize } from "@uidotdev/usehooks";
// COMPONENT
import Header from "@components/common/Header";
import CustomButton from "@components/kit/button/CustomButton";
import TextareaInput from "@components/kit/Input/TextareaInput";
// COMPONENT DYNAMIC IMPORT
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });

export default function RootSubjects({
  t,
  rootSubjects,
  modalSubject,
  setModalSubject,
  setSubjects,
  subjects,
  setSubjectOtherDescription,
  subjectOtherDescription,
  handleValueChange,
}) {
  const size = useWindowSize();
  const isMobile = size.width < 960;
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [text, setText] = useState(subjectOtherDescription);
  const [subjectsSelected, setSubjectsSelected] = useState(subjects);
  const lang = getCookie("NEXT_LOCALE");

  /////////////////////////////////////////////////////
  const addItem = (_id, name) => {
    if (subjectsSelected.filter((i) => i._id === _id).length == 0) {
      if (
        (showOtherInput && subjectsSelected.length < 2) ||
        (!showOtherInput && subjectsSelected.length < 3)
      ) {
        setSubjectsSelected([...subjectsSelected, { _id, name }]);
      }
    } else {
      const _subjectsSelected = [...subjectsSelected];
      const indexOfObject = _subjectsSelected.findIndex((object) => {
        return object._id === _id;
      });

      if (indexOfObject !== -1) {
        _subjectsSelected.splice(indexOfObject, 1);
      }
      setSubjectsSelected([..._subjectsSelected]);
    }
  };
  /////////////////////////////////////////////////////
  const handleOtherCheckbox = () => {
    if (!showOtherInput) {
      if (subjectsSelected.length < 3) {
        setShowOtherInput(true);
      }
    } else {
      setShowOtherInput(false);
      setErrorText(false);
    }
  };

  const confirmSubjects = () => {
    setSubjects(subjectsSelected);
    if (showOtherInput) {
      if (text) {
        setSubjectOtherDescription(text);
        setModalSubject(false);
        document.body.style.overflow = "unset";
      } else {
        setErrorText(true);
      }
    } else {
      setSubjectOtherDescription("");
      setErrorText(false);
      setModalSubject(false);
      document.body.style.overflow = "unset";
    }
  };

  useEffect(() => {
    setShowOtherInput(!!subjectOtherDescription);
    const arr = [];
    for (let index = 0; index < subjectsSelected.length; index++) {
      const i = rootSubjects.findIndex((e) =>
        e.children.some((i) => i._id === subjectsSelected[index]._id)
      );
      arr.push(i);
    }
  }, []);

  useEffect(() => {
    if (text !== "") {
      setErrorText(false);
    }
  }, [text]);

  return (
    <>
      <ModalScreen open={modalSubject} top="top-0 lg:top-[123px] relative m-auto">
        <Header
          onClick={() => {
            setModalSubject(false);
            document.body.style.overflow = "unset";
          }}
          title={t("chooseTopic")}
        />
        <div className="px-4 pt-[11px] lg:px-[30px] lg:pt-[7px]">
          {rootSubjects
            .filter((_i) => _i.children.length !== 0)
            .map((item, index) => (
              <div key={index} className={`w-full border-b-[1px] py-4`}>
                <div className={`flex items-center mb-[5px] gap-x-[10px]`}>
                  <input
                    type="checkbox"
                    id={`checkbox_${index}`}
                    checked={subjectsSelected.filter((j) => j._id === item._id).length !== 0}
                    onChange={() => addItem(item._id, item.name)}
                    className="w-5 h-5 rounded-sm border-[1px] border-gray5"
                  />
                  <label htmlFor={`checkbox_${index}`} className="title1 cursor-pointer">
                    {item.name}
                  </label>
                </div>
                <div className={`flex flex-wrap caption3 text-gray2 w-full`}>
                  {item.children.map((i, _i) => (
                    <p key={_i} className={` whitespace-normal break-words`}>
                      {i.name}
                      {_i !== item.children.length - 1 && (lang == "ar" ? "،" : " , ")}
                    </p>
                  ))}
                </div>
              </div>
            ))}

          <div className={`py-4`}>
            <label
              htmlFor="checkbox_other"
              className={`flex items-center gap-x-[10px] w-full cursor-pointer`}
            >
              <input
                type="checkbox"
                name="input"
                id="checkbox_other"
                value={showOtherInput}
                checked={showOtherInput}
                onChange={handleOtherCheckbox}
                className="w-5 h-5 rounded-sm border-[1px] border-gray5"
              />
              <p className="title1">{t("other")}</p>
            </label>
            <div className={`${showOtherInput ? "" : "pointer-events-none opacity-60"}`}>
              <TextareaInput
                t={t}
                value={text}
                setValue={(newText) => handleValueChange(newText, setText, setErrorText)}
                maxLength={500}
                placeholder={t("write")}
                showMaxLengthLabel={true}
                characterCount={text?.length}
                errorText={errorText ? t("emptyMessage") : ""}
              />
            </div>
          </div>
        </div>
        <div className="px-4 pt-[10px] pb-[20px] lg:px-[30px] bottom-0 sticky bg-white">
          <CustomButton
            onClick={() => confirmSubjects()}
            title={t("confirm")}
            isFullWidth={true}
            size={isMobile ? "S" : "M"}
          />
        </div>
      </ModalScreen>
    </>
  );
}
