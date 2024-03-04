import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { ArrowCircleDown, ArrowCircleUp, MessageText, Subtitle } from "iconsax-react";
//GQL
import { USER_EDIT_PROJECT_REQUEST } from "@services/gql/mutation/USER_EDIT_PROJECT_REQUEST";
import { USER_SUBMIT_PROJECT_REQUEST } from "@services/gql/mutation/USER_SUBMIT_PROJECT_REQUEST";
//FUNCTION
import { getJustTime } from "@functions/getJustTime";
import { toEnglishDigits } from "@functions/toEnglishDigits";
import { handleMainPicture } from "@functions/handleMainPicture";
//COMPONENT
import Header from "@components/common/Header";
import PlainInput from "@components/kit/Input/PlainInput";
import CustomButton from "@components/kit/button/CustomButton";
import TextareaInput from "@components/kit/Input/TextareaInput";
//COMPONENT DYNAMIC IMPORT
const OptionalItems = dynamic(() => import("./OptionalItems"), { ssr: false });
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const LocationInput = dynamic(() => import("@components/kit/Input/LocationInput"), { ssr: false });

export default function RequestForm({
  t,
  tPF,
  rootSubjects,
  allCategories,
  requestId,
  data,
  setConfirmLoading,
}) {
  //VARIABLE
  const router = useRouter();
  const lang = getCookie("NEXT_LOCALE");
  const size = useWindowSize();
  const isMobile = size.width < 960;
  const [muation_create_request] = useMutation(USER_SUBMIT_PROJECT_REQUEST);
  const [edit_request] = useMutation(USER_EDIT_PROJECT_REQUEST);
  const [title, setTitle] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectOtherDescription, setSubjectOtherDescription] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [deletedRequirements, setDeletedRequirements] = useState([]);
  const [tags, setTags] = useState([]);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [address, setAddress] = useState("");
  const [imagesUrl, setImagesUrl] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [locationPoint, setLocationPoint] = useState({ lat: null, lng: null });
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [showHideMoreDetail, setShowHideMoreDetail] = useState(false);

  //FUNCTION
  useEffect(() => {
    if (data) {
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
      setSubjectOtherDescription(data.subjectHasOther ? data?.subjectOtherDescription : "");
      setRequirements(
        data.requirements
          ? [
              ...data.requirements.map((item) => ({
                ...item,
                flag: "SAME",
              })),
            ]
          : []
      );
      setTags(data.tags);
      setDate(data.dueDate ?? null);
      setTime(data.dueDate ? getJustTime(data.dueDate, lang) : null);
      const imagesObject = data?.imgs?.map((img, i) => ({
        url: img,
        id: (Math.random() + 1).toString(16).slice(2),
        isMainPicture: handleMainPicture(i),
      }));
      setImagesUrl(data.imgs ? imagesObject : []);
      setAddress(data.location?.address);
      setLocationPoint({ lat: data.location?.geo.lat, lng: data.location?.geo.lon });
      setDescription(data.description.split("</br>").join("\n"));
    }
  }, []);

  useEffect(() => {
    if (titleError || descriptionError || locationError) {
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
    }
  }, [titleError, descriptionError, locationError, title, description, locationPoint]);

  const createRequest = async () => {
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
    if (title !== "" && locationPoint.lat && description !== "") {
      const variables = {
        data: {
          title,
          subjects: subjects.map((i) => i._id),
          subjectHasOther: subjectOtherDescription === "" ? false : true,
          subjectOtherDescription,
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
          tags,
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
          description: description.replace(/\r\n|\r|\n/g, "</br>"),
          dueDate: date
            ? new Date(
                `${toEnglishDigits(
                  new DateObject(date).convert(gregorian, gregorian_en).format()
                )} ${time || "09:00"}`
              ).toISOString()
            : null,
        },
      };

      setConfirmLoading(true);
      try {
        if (!data) {
          const {
            data: { user_submitProjectRequest },
          } = await muation_create_request({
            variables,
          });
          if (user_submitProjectRequest._id) {
            toast.custom(() => <Toast text={tPF("requestRegistered")} />);
            setTimeout(() => {
              toast.remove();
              router.push(
                `/activity/project-request-management/${user_submitProjectRequest._id}`,
                undefined,
                { shallow: true }
              );
            }, 1000);
          }
        } else {
          const {
            data: { user_edit_projectRequest },
          } = await edit_request({
            variables: {
              ...variables,
              requestId,
            },
          });
          if (user_edit_projectRequest.status === 200) {
            toast.custom(() => <Toast text={tPF("requestRegistered")} />);
            setTimeout(() => {
              toast.remove();
              router.push(`/activity/project-request-management/${requestId}`, undefined, {
                shallow: true,
              });
            }, 1000);
          }
        }
      } catch (error) {
        if (error.message === "Authorization failed" || error.message === "Token required") {
          setConfirmLoading(true);
          router.push("/login", undefined, { shallow: true });
        }
        console.error(error);
      }
    }
  };

  //JSX
  return (
    <>
      <section className="createP relative 2xl:w-[1320px] 2xl: m-auto">
        <Header
          title={data ? t("editRequest") : tPF("createRequest")}
          onClick={() => router.push("/", undefined, { shallow: true })}
          hasBackButton={isMobile}
        />
        <>
          <header className="px-4 lg:px-[30px] lg:pt-[4px] mb-[32px] lg:mb-[56px]">
            <div>
              <h1 className="cta3 lg:titleDesktop1 mb-1 text-black">{tPF("tHeaderR")}</h1>
              <p className="caption1 lg:captionDesktop3 text-gray3">{tPF("dHeaderR")}</p>
            </div>
          </header>
          <main className="px-4 lg:px-[30px] scrollbar-hide pb-[76px]">
            <PlainInput
              value={title}
              setValue={setTitle}
              labelText={tPF("requestTitle")}
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
                setValue={setDescription}
                errorText={descriptionError ? t("forceToFill") : ""}
                maxLength={1000}
                placeholder={t("write")}
                labelText={t("description")}
                icon={<MessageText size={18} />}
                showMaxLengthLabel={true}
                characterCount={description?.length}
              />
              <LocationInput
                t={t}
                value={locationPoint}
                setValue={setLocationPoint}
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
                setDate={setDate}
                setTime={setTime}
                date={date}
                time={time}
                subjects={subjects}
                setSubjects={setSubjects}
                rootSubjects={rootSubjects}
                subjectOtherDescription={subjectOtherDescription}
                setSubjectOtherDescription={setSubjectOtherDescription}
                address={address}
                setAddress={setAddress}
                setUploadLoading={setUploadLoading}
                uploadLoading={uploadLoading}
              />
            </div>
            <div className="mt-[30px] lg:mt-[56px]">
              <CustomButton
                onClick={() => createRequest()}
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
