import { useState } from "react";
import dynamic from "next/dynamic";
import { getCookie } from "cookies-next";
import { useWindowSize } from "@uidotdev/usehooks";
import { getRequirementsName } from "@functions/getRequirementsName";
import CustomTransitionModal from "@components/kit/modal/CustomTransitionModal";
import {
  ArrowCircleDown,
  CloseCircle,
  Map,
  MenuBoard,
  Tag,
  TextalignJustifycenter,
} from "iconsax-react";
//COMPONENT
import AddTags from "@components/common/AddTags";
import UploadImages from "@components/common/uploadImages/Main";
import PlainInput from "@components/kit/Input/PlainInput";
//COMPONENT DYNAMIC IMPORT
const DateTimeInputs = dynamic(() => import("@components/common/form/DateTimeInputs"), {
  ssr: false,
});
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const RootSubjects = dynamic(() => import("@components/common/RootSubjects"), { ssr: false });
const RequirementPicker = dynamic(() => import("@components/common/requirementPicker/Main"), {
  ssr: false,
});

export default function OptionalItems({
  t,
  tPF,
  data,
  // setOpenRequirementModal,
  setRequirements,
  requirements,
  setDeletedRequirements,
  deletedRequirements,
  setTags,
  tags,
  allCategories,
  // setOpenSubjectModal,
  subjects,
  setSubjects,
  rootSubjects,
  subjectOtherDescription,
  setSubjectOtherDescription,
  address,
  setAddress,
  setDate,
  setTime,
  date,
  time,
  setImagesUrl,
  imagesUrl,
  setUploadLoading,
  uploadLoading,
}) {
  const lang = getCookie("NEXT_LOCALE");
  const isMobile = useWindowSize().width < 960;

  //////////////////////////////STATES//////////////////////////////
  const [modalSubject, setModalSubject] = useState(false);
  const [requirementsListModal, setRequirementsListModal] = useState(false);
  const [openModalTag, setOpenModalTag] = useState(false);

  //////////////////////////////FUNCTIONS//////////////////////////////
  const deleteRequirement = (type) => {
    const _deleteRequirements = requirements.filter((i) => i.type === type);
    setDeletedRequirements((prev) => [...prev, ..._deleteRequirements]);
    setRequirements(requirements.filter((i) => i.type !== type));
  };

  const deleteSubject = (id) => {
    const _subjects = [...subjects];
    const indexOfObject = _subjects.findIndex((object) => {
      return object._id === id;
    });
    if (indexOfObject !== -1) {
      _subjects.splice(indexOfObject, 1);
      setSubjects(_subjects);
    }
  };

  const deleteTag = (deletedIndex) => {
    setTags(tags.filter((item, index) => index !== deletedIndex));
  };

  // useEffect(() => {
  //   setOpenRequirementModal(requirementsListModal)
  // }, [requirementsListModal])

  // useEffect(() => {
  //   setOpenSubjectModal(modalSubject)
  // }, [modalSubject])

  //////////////////////////////JSX//////////////////////////////
  return (
    <>
      <h2 className="caption1 lg:captionDesktop2 mb-[36px] lg:mb-[56px]">
        {tPF("moreDetailTitleR")}
      </h2>
      <div>
        <h5 className="heading text-[#000] mb-[7px]">{t("addPicture.choosePicture")}</h5>
        <p className="caption1 text-[#000]">{t("addPicture.choosePictureDes")}</p>
        <div className="mt-[27px] mb-[33px] lg:mb-[48px] relative">
          <UploadImages
            t={t}
            isInProject={true}
            setImagesUrl={setImagesUrl}
            imagesUrl={imagesUrl}
            setUploadLoading={setUploadLoading}
            uploadLoading={uploadLoading}
          />
        </div>
      </div>
      <div className="lg:mb-[41px] lg:grid lg:grid-cols-2 lg:gap-[41px]">
        <div className="mb-[29px] lg:mb-0 relative">
          <label
            className={`flex items-center justify-start mb-[9px] gap-x-[6px]`}
            htmlFor="subject"
          >
            <TextalignJustifycenter size={18} />
            <h5 className="titleInput text-black">{tPF("requestSubject")}</h5>
          </label>
          <div
            id="subject"
            className="flex justify-between items-center py-[11px] px-[13px] textInput rounded-lg border-[1px] border-gray5 outline-none cursor-pointer"
            onClick={() => setModalSubject(true)}
          >
            {(subjects.length !== 0 || subjectOtherDescription !== "") && (
              <div className="flex gap-1 flex-wrap">
                {subjects.length !== 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {subjects.map((item, index) => (
                      <span
                        key={index + "subjects"}
                        className={`flex items-center bg-gray5 border-[1px] border-gray5 rounded p-[6px] w-fit gap-x-1`}
                      >
                        <button
                          className={`rounded-full w-[14px] h-[14px] flex justify-center items-center`}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSubject(item._id);
                          }}
                        >
                          <CloseCircle color="#CB3A31" size={15} />
                        </button>
                        <span className="caption4">{item.name}</span>
                      </span>
                    ))}
                  </div>
                )}
                {subjectOtherDescription !== "" && (
                  <div
                    className={`flex items-center bg-gray5 border-[1px] border-gray5 rounded p-[6px] gap-x-1 w-fit`}
                  >
                    <button
                      className={`rounded-full w-[14px] h-[14px] flex justify-center items-center`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSubjectOtherDescription("");
                      }}
                    >
                      <CloseCircle color="#CB3A31" size={15} />
                    </button>
                    <p className="caption4">{t("other")}</p>
                  </div>
                )}
              </div>
            )}

            {subjects.length === 0 && subjectOtherDescription === "" && (
              <div className="inline-flex items-center lg:min-h-[32px]">
                <p className="text-gray4">{t("select")}</p>
              </div>
            )}
            <ArrowCircleDown color="#ACACAF" variant="Bulk" size={20} className="shrink-0" />
          </div>
        </div>
        <div className="my-[25px] lg:my-0 relative">
          <label
            className={`flex items-center justify-start mb-[9px] gap-x-[6px]`}
            htmlFor="requirementsList"
          >
            <MenuBoard size={18} />
            <h5 className="titleInput text-black">{tPF("requirementsList")}</h5>
          </label>
          <div
            id="requirementsList"
            className="flex justify-between items-center py-[11px] px-[13px] textInput rounded-lg border-[1px] border-gray5 outline-none cursor-pointer"
            onClick={() => {
              setRequirementsListModal(true);
              document.body.style.overflow = "hidden";
            }}
          >
            {requirements?.length === 0 ? <p className="text-gray4">{t("select")}</p> : null}
            <div className="flex gap-1 flex-wrap lg:min-h-[32px]">
              {Object?.values(
                requirements.reduce((acc, cur) => Object.assign(acc, { [cur.type]: cur }), {})
              )?.map((item, index) => (
                <span
                  key={index + "requirements"}
                  className={`flex items-center bg-gray5 border-[1px] border-gray5 rounded p-[6px] gap-x-1 w-fit`}
                >
                  <button
                    className={`rounded-full w-[14px] h-[14px] flex justify-center items-center `}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRequirement(item.type);
                    }}
                  >
                    <CloseCircle color="#CB3A31" size={15} />
                  </button>
                  <p className="caption4">{getRequirementsName(item.type, lang)}</p>
                </span>
              ))}
            </div>
            <ArrowCircleDown color="#ACACAF" variant="Bulk" size={20} className="shrink-0" />
          </div>
        </div>
      </div>
      <PlainInput
        value={address}
        setValue={setAddress}
        labelText={t("address")}
        icon={<Map size={18} />}
        placeholder={t("write")}
        maxLength={200}
        characterCount={address?.length}
        showMaxLengthLabel={true}
      />
      <DateTimeInputs
        t={t}
        tPF={tPF}
        setDate={setDate}
        setTime={setTime}
        time={time}
        date={date}
        isRange={false}
      />
      <div className="my-[25px] lg:mt-[35px] lg:mb-0 relative">
        <label className={`flex items-center justify-start mb-[9px] gap-x-[6px]`}>
          <Tag size={18} />
          <h5 className="titleInput text-black">{tPF("tag")}</h5>
        </label>
        <div
          className="flex justify-between items-center py-[11px] px-[13px] textInput rounded-lg border-[1px] border-gray5 outline-none cursor-pointer"
          onClick={() => setOpenModalTag(true)}
        >
          {tags?.length === 0 ? <p className="text-gray4">{t("select")}</p> : null}
          <div className="flex gap-1 flex-wrap lg:min-h-[32px]">
            {tags?.map((item, index) => (
              <span
                key={index + "tags"}
                className={`flex items-center bg-gray5 border-[1px] border-gray5 rounded p-[6px] gap-x-1 w-fit`}
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
          <ArrowCircleDown color="#ACACAF" variant="Bulk" size={20} className="shrink-0" />
        </div>
      </div>
      {/* ------------------------ modals --------------------*/}
      <RequirementPicker
        t={t}
        editMode={data ? true : false}
        allCategories={allCategories}
        setRequirements={setRequirements}
        requirements={requirements}
        open={requirementsListModal}
        setOpen={setRequirementsListModal}
        setDeletedRequirements={setDeletedRequirements}
        deletedRequirements={deletedRequirements}
      />

      {modalSubject && (
        <RootSubjects
          t={t}
          tPF={tPF}
          rootSubjects={rootSubjects}
          modalSubject={modalSubject}
          setModalSubject={setModalSubject}
          setSubjects={setSubjects}
          subjects={subjects}
          subjectOtherDescription={subjectOtherDescription}
          setSubjectOtherDescription={setSubjectOtherDescription}
        />
      )}

      {isMobile ? (
        <BottomSheet open={openModalTag} setOpen={setOpenModalTag}>
          <AddTags
            tPF={tPF}
            tags={tags}
            setTags={setTags}
            t={t}
            setOpenModalTag={setOpenModalTag}
            openModalTag={openModalTag}
          />
        </BottomSheet>
      ) : (
        <CustomTransitionModal
          open={openModalTag}
          close={() => setOpenModalTag(false)}
          width="500px"
        >
          <AddTags
            tPF={tPF}
            tags={tags}
            setTags={setTags}
            t={t}
            setOpenModalTag={setOpenModalTag}
            openModalTag={openModalTag}
          />
        </CustomTransitionModal>
      )}
    </>
  );
}
