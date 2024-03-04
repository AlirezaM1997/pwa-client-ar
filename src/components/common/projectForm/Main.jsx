import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { ArrowCircleDown, ArrowCircleUp, MessageText, Subtitle } from "iconsax-react";
//GQL
import { ASSOCIATION_CREATE_PROJECT } from "@services/gql/mutation/ASSOCIATION_CREATE_PROJECT";
import { ASSOCIATION_DIRECT_EDIT_PROJECT } from "@services/gql/mutation/ASSOCIATION_DIRECT_EDIT_PROJECT";
import { ASSOCIATION_CONDITIONAL_EDIT_PROJECT } from "@services/gql/mutation/ASSOCIATION_CONDITIONAL_EDIT_PROJECT";
//FUNCTION
import { getJustTime } from "@functions/getJustTime";
import { toEnglishDigits } from "@functions/toEnglishDigits";
import { handleMainPicture } from "@functions/handleMainPicture";
import { getRequirementsName } from "@functions/getRequirementsName";
//COMPONENT
import Header from "@components/common/Header";
import PlainInput from "@components/kit/Input/PlainInput";
import CustomButton from "@components/kit/button/CustomButton";
import TextareaInput from "@components/kit/Input/TextareaInput";
//COMPONENT DYNAMIC IMPORT
const OptionalItems = dynamic(() => import("./OptionalItems"), { ssr: false });
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const LocationInput = dynamic(() => import("@components/kit/Input/LocationInput"), { ssr: false });

export default function ProjectForm({
  t,
  tPF,
  rootSubjects,
  allCategories,
  associationId,
  data,
  isEditProject,
  isProposal,
  isEditProposal,
  setConfirmLoading,
  projectStatus,
}) {
  //////////////////////////HOOKS//////////////////////////
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();
  const size = useWindowSize();
  const isMobile = size.width < 960;

  //////////////////////////API//////////////////////////
  // const [edit_project] = useMutation(EDIT_PROJECT);
  const [mutation_create_project] = useMutation(ASSOCIATION_CREATE_PROJECT);
  const [edit_pending_project] = useMutation(ASSOCIATION_DIRECT_EDIT_PROJECT);
  const [edit_active_project] = useMutation(ASSOCIATION_CONDITIONAL_EDIT_PROJECT);

  //////////////////////////STATES//////////////////////////
  const [title, setTitle] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [subjectOtherDescription, setSubjectOtherDescription] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [deletedRequirements, setDeletedRequirements] = useState([]);
  const [tags, setTags] = useState([]);
  const [address, setAddress] = useState("");
  const [imagesUrl, setImagesUrl] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [locationPoint, setLocationPoint] = useState({ lat: null, lng: null });
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [audience, setAudience] = useState(["all", null, null]);
  const [userType, setUserType] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [serviceSetting, setServiceSetting] = useState({
    description: null,
    hasService: null,
    location: {
      address: null,
      geo: {
        lat: null,
        lng: null,
      },
    },
    serviceDate: null,
    serviceReceiverTemp: [],
    servicesVisibilitySetting: {
      array: [],
      type: null,
    },
    title: null,
    type: null,
  });

  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [wrongDate, setWrongDate] = useState(false);
  const [showHideMoreDetail, setShowHideMoreDetail] = useState(false);

  //////////////////////////FUNCTIONS//////////////////////////

  const handleValueChange = (value, stateName, errorStateName) => {
    if (!value || !stateName) {
      if (errorStateName) {
        errorStateName(true);
      }
    }
    stateName(value);
    setIsButtonDisabled(false);
  };

  useEffect(() => {
    if (isEditProject || isProposal || isEditProposal) {
      setTitle(data.title);
      setSubjects(
        data?.subjects
          ? [
              ...data.subjects.map((item) => ({
                ...item,
              })),
            ]
          : []
      );
      setSubjectOtherDescription(data?.subjectHasOther ? data?.subjectOtherDescription : "");
      setRequirements(
        data?.requirements
          ? [
              ...data.requirements.map((item) => ({
                ...item,
                flag: isEditProject ? "SAME" : "NEW",
              })),
            ]
          : []
      );
      setTags(data.tags || []);
      setStartDate(
        (function () {
          const dt = isEditProject || isEditProposal ? data?.associationObject?.startDate : null;
          return dt ?? null;
        })()
      );
      setEndDate(
        (function () {
          const dt = isEditProject || isEditProposal ? data?.associationObject?.endDate : null;
          return dt ?? null;
        })()
      );
      setStartTime(
        (function () {
          const dt = isEditProject || isEditProposal ? data?.associationObject?.startDate : null;
          return dt ? getJustTime(dt, lang) : null;
        })()
      );
      setEndTime(
        (function () {
          const dt = isEditProject || isEditProposal ? data?.associationObject?.endDate : null;
          return dt ? getJustTime(dt, lang) : null;
        })()
      );
      setAddress(data.location.address);
      setLocationPoint({ lat: data?.location.geo.lat, lng: data?.location.geo.lon });
      setDescription(data.description.split("</br>").join("\n"));
      const imagesObject = data?.imgs?.map((img, i) => ({
        url: img,
        id: (Math.random() + 1).toString(16).slice(2),
        isMainPicture: handleMainPicture(i),
      }));
      setImagesUrl(data.imgs ? imagesObject : []);
      setAudience(
        isEditProject || isEditProposal
          ? [
              data.associationObject?.audience?.gender,
              data.associationObject?.audience?.minAge,
              data.associationObject?.audience?.maxAge,
            ]
          : ["all", null, null]
      );
      setUserType([]);
      setUserIds([]);
      setServiceSetting({
        description: data?.serviceSetting?.description,
        hasService: data?.serviceSetting?.hasService,
        location: {
          address: data?.serviceSetting?.location?.address,
          geo: {
            lat: data?.serviceSetting?.location?.geo?.lat,
            lng: data?.serviceSetting?.location?.geo?.lon,
          },
        },
        serviceDate: data?.serviceSetting?.serviceDate,
        serviceReceiverTemp: [],
        servicesVisibilitySetting: {
          array: [],
          type: data?.serviceSetting?.servicesVisibilitySetting?.type,
        },
        title: data?.serviceSetting?.title,
        type: data?.serviceSetting?.type
          ? {
              value: data?.serviceSetting?.type,
              label: getRequirementsName(data?.serviceSetting?.type, lang),
            }
          : null,
      });
    }
  }, [data]);

  useEffect(() => {
    if (titleError || descriptionError || locationError || wrongDate) {
      if (title === "") {
        setTitleError(true);
      } else {
        setTitleError(false);
      }
      if (description === "") {
        setDescriptionError(true);
      } else {
        setDescriptionError(false);
      }
      if (!locationPoint.lat) {
        setLocationError(true);
      } else {
        setLocationError(false);
      }
      if (startDate > endDate) {
        setWrongDate(true);
      } else {
        setWrongDate(false);
      }
    }
  }, [
    wrongDate,
    titleError,
    descriptionError,
    locationError,
    title,
    description,
    locationPoint,
    startDate,
    endDate,
  ]);

  const createProject = async () => {
    if (title === "") {
      setTitleError(true);
    } else {
      setTitleError(false);
    }
    if (description === "") {
      setDescriptionError(true);
    } else {
      setDescriptionError(false);
    }
    if (!locationPoint.lat) {
      setLocationError(true);
    } else {
      setLocationError(false);
    }
    if (startDate > endDate) {
      setWrongDate(true);
    } else {
      setWrongDate(false);
    }
    if (
      title !== "" &&
      locationPoint.lat &&
      description !== "" &&
      (endDate && startDate ? startDate <= endDate : true)
    ) {
      const variables = {
        data: {
          description: description.replace(/\r\n|\r|\n/g, "</br>"),
          dueDate: null,
          location: {
            address,
            geo: {
              lat: locationPoint.lat,
              lon: locationPoint.lng,
            },
          },
          imgs:
            imagesUrl.length !== 0
              ? imagesUrl.sort((a, b) => b.isMainPicture - a.isMainPicture).map((item) => item.url)
              : [],
          tags,
          requirements: !data
            ? requirements
                .map((object) => {
                  return {
                    ...object,
                    _id: null,
                    flag: "NEW",
                    categoryId: "640705221e088b1cb6ddc85c",
                    subcategoryId: "640705221e088b1cb6ddc85d",
                    levelId: "640705221e088b1cb6ddc85e",
                    amount: object.amount ? Number(object?.amount) : null,
                    title: "1",
                  };
                })
                // eslint-disable-next-line no-unused-vars
                .map(({ __typename, ...rest }) => rest)
            : requirements
                .map((object) => {
                  if (object.flag === "NEW") {
                    return {
                      ...object,
                      _id: null,
                      categoryId: "640705221e088b1cb6ddc85c",
                      subcategoryId: "640705221e088b1cb6ddc85d",
                      levelId: "640705221e088b1cb6ddc85e",
                      amount: object.amount ? Number(object?.amount) : null,
                      title: "1",
                    };
                  } else {
                    return {
                      ...object,
                      _id: object._id,
                      categoryId: "640705221e088b1cb6ddc85c",
                      subcategoryId: "640705221e088b1cb6ddc85d",
                      levelId: "640705221e088b1cb6ddc85e",
                      amount: object.amount ? Number(object?.amount) : null,
                      title: "1",
                    };
                  }
                })
                // eslint-disable-next-line no-unused-vars
                .map(({ category, subCategory, level, __typename, ...rest }) => rest)
                .concat(
                  deletedRequirements
                    .filter((i) => i._id)
                    // eslint-disable-next-line no-unused-vars
                    ?.map(({ category, subCategory, level, __typename, ...rest }) => rest)
                    .map((item) => ({
                      ...item,
                      flag: "DELETE",
                      categoryId: "640705221e088b1cb6ddc85c",
                      subcategoryId: "640705221e088b1cb6ddc85d",
                      levelId: "640705221e088b1cb6ddc85e",
                      title: "1",
                    }))
                ),
          subjects: subjects.length !== 0 ? subjects.map((i) => i._id) : [],
          subjectHasOther: subjectOtherDescription === "" ? false : true,
          subjectOtherDescription,
          title,
        },
        associationSpeceficData: {
          audience: {
            gender: audience[0],
            minAge: audience[1] ? Number(audience[1]) : null,
            maxAge: audience[2] ? Number(audience[2]) : null,
          },
          startDate: startDate
            ? new Date(
                `${toEnglishDigits(
                  new DateObject(startDate).convert(gregorian, gregorian_en).format()
                )} ${startTime ? startTime : "09:00"}`
              ).toISOString()
            : null,
          endDate: endDate
            ? new Date(
                `${toEnglishDigits(
                  new DateObject(endDate).convert(gregorian, gregorian_en).format()
                )} ${endTime ? endTime : "09:00"}`
              ).toISOString()
            : null,
          visibilitySetting: {
            isPublic: userType.length !== 0 || userIds.length !== 0 ? false : true,
            roles: userType?.map((i) => i?.value),
            userIds: userIds?.map((i) => i?.value),
          },
        },
        serviceSetting: serviceSetting.hasService
          ? {
              description: serviceSetting.description,
              hasService: true,
              location: {
                address: serviceSetting.location.address,
                geo: serviceSetting.location.geo.lat
                  ? {
                      lat: serviceSetting.location.geo.lat,
                      lon: serviceSetting.location.geo.lng,
                    }
                  : null,
              },
              serviceDate: serviceSetting.serviceDate,
              serviceReceiverTemp: serviceSetting.serviceReceiverTemp.map((i) => i._id),
              servicesVisibilitySetting: {
                array: serviceSetting.servicesVisibilitySetting.array.map((i) => i.name),
                type: serviceSetting.servicesVisibilitySetting.type,
              },
              title: serviceSetting.title,
              type: serviceSetting.type ? serviceSetting.type?.value : null,
            }
          : { hasService: false },
        requestId: isEditProposal ? data?.correspondingRequest?._id : data?._id,
        projectId: isEditProject ? data?._id : null,
      };
      if (!isEditProject && !isProposal && !isEditProposal) {
        setConfirmLoading(true);
        delete variables.projectId;
        delete variables.requestId;
        try {
          const {
            data: { association_createProject },
          } = await mutation_create_project({
            variables,
          });
          if (association_createProject._id) {
            router.push(
              `/activity/project-management/${association_createProject._id}`,
              undefined,
              { shallow: true }
            );
          }
        } catch (error) {
          setConfirmLoading(false);
          if (error.message === "Authorization failed" || error.message === "Token required") {
            router.push("/login", undefined, { shallow: true });
          } else {
            toast.custom(() => <Toast text={error.message} status="ERROR" />);
          }
        }
      }
      if (isEditProject) {
        setConfirmLoading(true);
        delete variables.requestId;
        if (projectStatus === "ACTIVE") {
          try {
            const {
              data: { association_conditional_edit_project },
            } = await edit_active_project({
              variables,
            });

            if (association_conditional_edit_project.status === 200) {
              router.push(`/activity/project-management/${data._id}`, undefined, { shallow: true });
              toast.custom(() => <Toast text={tPF("conditionalEditSuccess")} status="SUCCESS" />);
            }
          } catch (error) {
            setConfirmLoading(false);
            if (error.message === "Authorization failed" || error.message === "Token required") {
              router.push("/login", undefined, { shallow: true });
            } else {
              toast.custom(() => <Toast text={error.message} status="ERROR" />);
            }
          }
        } else {
          try {
            const {
              data: { association_direct_edit_project },
            } = await edit_pending_project({
              variables,
            });

            if (association_direct_edit_project.status === 200) {
              router.push(`/activity/project-management/${data._id}`, undefined, { shallow: true });
              toast.custom(() => <Toast text={tPF("directEditSuccess")} status="SUCCESS" />);
            }
          } catch (error) {
            setConfirmLoading(false);
            if (error.message === "Authorization failed" || error.message === "Token required") {
              router.push("/login", undefined, { shallow: true });
            } else {
              toast.custom(() => <Toast text={error.message} status="ERROR" />);
            }
          }
        }
      }
    }
  };

  //////////////////////////JSX//////////////////////////
  return (
    <>
      <section className="createP relative 2xl:w-[1320px] 2xl: m-auto">
        <Header
          hasBackButton={isMobile}
          onClick={() => router.push("/", undefined, { shallow: true })}
          title={isEditProject ? t("editProject") : tPF("createPtoject")}
        />
        <>
          <header className="px-4 lg:px-[30px] lg:pt-[4px] mb-[32px] lg:mb-[56px]">
            <div>
              <h1 className="cta3 lg:titleDesktop1 mb-1 text-black">
                {isEditProposal || isProposal ? tPF("projectProposalForm") : tPF("tHeader")}
              </h1>
              <p className="caption1 lg:captionDesktop3 text-gray3">
                {isEditProposal || isProposal ? tPF("projectProposalFormDes") : tPF("dHeader")}
              </p>
            </div>
          </header>
          <main className="px-4 lg:px-[30px] scrollbar-hide pb-[76px]">
            <PlainInput
              value={title}
              setValue={(newTitle) => handleValueChange(newTitle, setTitle, setTitleError)}
              labelText={tPF("projectTitle")}
              icon={<Subtitle size={18} />}
              placeholder={t("write")}
              errorText={titleError ? t("forceToFill") : ""}
              characterCount={title?.length}
              maxLength={50}
              showMaxLengthLabel={true}
            />
            <div className={isMobile ? "" : "grid grid-cols-2 gap-[41px] mb-[50px]"}>
              <TextareaInput
                t={t}
                value={description}
                setValue={(newDescription) =>
                  handleValueChange(newDescription, setDescription, setDescriptionError)
                }
                errorText={descriptionError ? t("forceToFill") : ""}
                maxLength={1000}
                placeholder={t("placeholderCreateProject")}
                labelText={t("description")}
                icon={<MessageText size={18} />}
                showMaxLengthLabel={true}
                characterCount={description?.length}
              />
              <LocationInput
                t={t}
                value={locationPoint}
                setValue={(newLocation) =>
                  handleValueChange(newLocation, setLocationPoint, setLocationError)
                }
                errorKind={locationError}
                errorText={t("forceToFill")}
                iconSize={18}
              />
            </div>
            <div
              onClick={() => setShowHideMoreDetail(!showHideMoreDetail)}
              className="bg-main7 caption5 rounded-lg py-[13px] px-[11px] flex justify-between items-center cursor-pointer"
            >
              <div className="text-main2 flex flex-row gap-[10px]">
                <span>{t("moreDetail")}</span>
                <span className="mr-1 ltr:ml-1 opacity-50">({t("optional")})</span>
              </div>
              <div className="ltr:mr-[2px] rtl:ml-[2px]">
                {showHideMoreDetail ? (
                  <ArrowCircleUp color="#03A6CF" variant="Bulk" size={20} />
                ) : (
                  <ArrowCircleDown color="#03A6CF" variant="Bulk" size={20} />
                )}
              </div>
            </div>
            <div className={`mt-[14px] ${showHideMoreDetail ? "" : "hidden"}`}>
              <OptionalItems
                t={t}
                tPF={tPF}
                data={data}
                setImagesUrl={setImagesUrl}
                imagesUrl={imagesUrl}
                setRequirements={setRequirements}
                requirements={requirements}
                setDeletedRequirements={setDeletedRequirements}
                deletedRequirements={deletedRequirements}
                setTags={setTags}
                tags={tags}
                allCategories={allCategories}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                subjects={subjects}
                setSubjects={setSubjects}
                rootSubjects={rootSubjects}
                subjectOtherDescription={subjectOtherDescription}
                setSubjectOtherDescription={setSubjectOtherDescription}
                address={address}
                setAddress={setAddress}
                setUploadLoading={setUploadLoading}
                uploadLoading={uploadLoading}
                audience={audience}
                setAudience={setAudience}
                setUserType={setUserType}
                userType={userType}
                setUserIds={setUserIds}
                userIds={userIds}
                associationId={associationId}
                wrongDate={wrongDate}
                isEditProject={isEditProject}
                handleValueChange={handleValueChange}
              />
            </div>
            <div className="mt-[30px] lg:mt-[56px] z-[1000] py-4 w-full bottom-0 sticky bg-white">
              <CustomButton
                isDisabled={isButtonDisabled || uploadLoading}
                onClick={() => createProject()}
                isFullWidth={true}
                title={t("confirm")}
                size="S"
              />
            </div>
          </main>
        </>
      </section>
    </>
  );
}
