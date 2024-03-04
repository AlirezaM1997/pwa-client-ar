import { useState } from "react";
import dynamic from "next/dynamic";
import { getCookie } from "cookies-next";
import {
  ArrowCircleDown,
  CloseCircle,
  Map,
  MenuBoard,
  TextalignJustifycenter,
  UserSquare,
  Tag,
} from "iconsax-react";
import { useWindowSize } from "@uidotdev/usehooks";
//FUNCTION
import { handleAge } from "@functions/handleAge";
import { getGenderName } from "@functions/getGenderName";
import { getRequirementsName } from "@functions/getRequirementsName";
//COMPONENT
import PlainInput from "@components/kit/Input/PlainInput";
//COMPONENT DYNAMIC IMPORT
const AddTags = dynamic(() => import("@components/common/AddTags"), { ssr: false });
const Audience = dynamic(() => import("@components/common/Audience"), { ssr: false });
const DateTimeInputs = dynamic(() => import("@components/common/form/DateTimeInputs"), {
  ssr: false,
});
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const UploadImages = dynamic(() => import("@components/common/uploadImages/Main"), { ssr: false });
const RootSubjects = dynamic(() => import("@components/common/RootSubjects"), { ssr: false });
const RequirementPicker = dynamic(() => import("@components/common/requirementPicker/Main"), {
  ssr: false,
});
const CustomTransitionModal = dynamic(() => import("@components/kit/modal/CustomTransitionModal"), {
  ssr: false,
});

export default function OptionalItems({
  t,
  tPF,
  audience,
  setAudience,
  setRequirements,
  requirements,
  setDeletedRequirements,
  deletedRequirements,
  setTags,
  tags,
  allCategories,
  data,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  subjects,
  setImagesUrl,
  imagesUrl,
  setSubjects,
  rootSubjects,
  setSubjectOtherDescription,
  subjectOtherDescription,
  address,
  setAddress,
  setUploadLoading,
  uploadLoading,
  isEditProject,
  handleValueChange,
}) {
  const lang = getCookie("NEXT_LOCALE");
  const size = useWindowSize();
  const isMobile = size.width < 960;
  const [modalSubject, setModalSubject] = useState(false);
  const [requirementsListModal, setRequirementsListModal] = useState(false);
  const [openModalTag, setOpenModalTag] = useState(false);
  const [openTargetAudience, setOpenTargetAudience] = useState(false);

  const deleteRequirement = (type) => {
    if (isEditProject) {
      const _deleteRequirements = requirements.filter((i) => i.type === type);
      setDeletedRequirements((prev) => [...prev, ..._deleteRequirements]);
    }
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

  return (
    <>
      <h2 className="caption1 lg:captionDesktop2 mb-[36px] lg:mb-[56px]">
        {tPF("moreDetailTitle")}
      </h2>
      <section>
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
              className="flex items-center justify-start mb-[9px] gap-x-[6px]"
              htmlFor="subject"
            >
              <TextalignJustifycenter size={18} />
              <h5 className="titleInput text-black">{tPF("projectSubject")}</h5>
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
                          className="flex items-center bg-gray5 border-[1px] border-gray5 rounded p-[6px] w-fit gap-x-1"
                        >
                          <button
                            className="rounded-full w-[14px] h-[14px] flex justify-center items-center"
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
              htmlFor="subject"
            >
              <MenuBoard size={18} />
              <h5 className="titleInput text-black">{tPF("requirementsList")}</h5>
            </label>
            <div
              className="flex justify-between items-center py-[11px] px-[13px] textInput rounded-lg border-[1px] border-gray5 outline-none cursor-pointer"
              onClick={() => {
                setRequirementsListModal(true);
                document.body.style.overflow = "hidden";
              }}
            >
              {requirements?.length === 0 && (
                <div className="inline-flex items-center lg:min-h-[32px]">
                  <p className="text-gray4">{t("select")}</p>
                </div>
              )}
              <div className="flex gap-1 flex-wrap lg:min-h-[32px]">
                {Object?.values(
                  requirements.reduce((acc, cur) => Object.assign(acc, { [cur.type]: cur }), {})
                )?.map((item, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-gray5 border-[1px] border-gray5 rounded p-[6px] w-fit gap-x-1"
                  >
                    <button
                      className="rounded-full w-[14px] h-[14px] flex justify-center items-center"
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
          setValue={(newAddress) => handleValueChange(newAddress, setAddress)}
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
          isRange={true}
          startDate={startDate}
          setStartDate={(newStartDate) => handleValueChange(newStartDate, setStartDate)}
          endDate={endDate}
          setEndDate={(newEndDate) => handleValueChange(newEndDate, setEndDate)}
          startTime={startTime}
          setStartTime={(newStartTime) => handleValueChange(newStartTime, setStartTime)}
          endTime={endTime}
          setEndTime={(newEndTime) => handleValueChange(newEndTime, setEndTime)}
        />
        <div
          className="relative my-[25px]  lg:mt-[35px] lg:mb-0"
          onClick={() => setOpenTargetAudience(true)}
        >
          <label
            className="flex items-center justify-start mb-[9px] gap-x-[6px]"
            htmlFor="audience"
          >
            <UserSquare size={18} />
            <h5 className="titleInput text-black">{tPF("targetAudience")}</h5>
          </label>
          <div
            id="audience"
            className="flex justify-between items-center w-full rounded-lg border border-gray5 py-2 lg:py-[14px] px-4 textInput text-black placeholder:text-gray4"
          >
            {(!audience[0] || audience[0] === "all") && !audience[1] && !audience[2] ? (
              <p className="text-gray4">{t("all")}</p>
            ) : (
              <p>{`${
                audience[0]
                  ? getGenderName(audience[0], lang) + (audience[1] || audience[2] ? " - " : "")
                  : ""
              } ${handleAge(audience[1], audience[2], t)}`}</p>
            )}
            <ArrowCircleDown color="#ACACAF" variant="Bulk" size={20} />
          </div>
        </div>
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
              {tags.map((item, index) => (
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
      </section>
      {/* ------------------------ modals --------------------*/}
      {requirementsListModal && (
        <RequirementPicker
          t={t}
          editMode={data ? true : false}
          allCategories={allCategories}
          setRequirements={(newRequirements) => handleValueChange(newRequirements, setRequirements)}
          requirements={requirements}
          open={requirementsListModal}
          setOpen={setRequirementsListModal}
          setDeletedRequirements={setDeletedRequirements}
          deletedRequirements={deletedRequirements}
        />
      )}
      {modalSubject && (
        <RootSubjects
          t={t}
          tPF={tPF}
          rootSubjects={rootSubjects}
          modalSubject={modalSubject}
          setModalSubject={setModalSubject}
          setSubjects={(newSubjects) => handleValueChange(newSubjects, setSubjects)}
          subjects={subjects}
          subjectOtherDescription={subjectOtherDescription}
          setSubjectOtherDescription={setSubjectOtherDescription}
          handleValueChange={handleValueChange}
        />
      )}
      {isMobile ? (
        <>
          <BottomSheet open={openTargetAudience} setOpen={setOpenTargetAudience}>
            <Audience
              t={t}
              setOpen={setOpenTargetAudience}
              audience={audience}
              setAudience={(newAudience) => handleValueChange(newAudience, setAudience)}
              isInFilter={false}
            />
          </BottomSheet>
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
        </>
      ) : (
        <>
          <CustomTransitionModal
            open={openTargetAudience}
            close={() => setOpenTargetAudience(false)}
            width="546px"
          >
            <Audience
              t={t}
              setOpen={(isOpen) => {
                if (!isOpen) document.body.style.overflow = "unset";
                setOpenTargetAudience(isOpen);
              }}
              audience={audience}
              setAudience={(newAudience) => handleValueChange(newAudience, setAudience)}
              isInFilter={false}
            />
          </CustomTransitionModal>
          <CustomTransitionModal
            open={openModalTag}
            close={() => setOpenModalTag(false)}
            width="500px"
          >
            <AddTags
              tPF={tPF}
              tags={tags}
              setTags={(newTag) => handleValueChange(newTag, setTags)}
              t={t}
              setOpenModalTag={setOpenModalTag}
              openModalTag={openModalTag}
            />
          </CustomTransitionModal>
        </>
      )}
    </>
  );
}
