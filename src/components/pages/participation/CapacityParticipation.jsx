import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { landingPageAction } from "@store/slices/landingPage";
import { saveToStorage } from "@functions/saveToStorage";
// GQL
import { PARTICIPATE_IN_PROJECT } from "@services/gql/mutation/PARTICIPATE_IN_PROJECT";
// COMPONENT
import ShowMoreText from "@components/common/ShowMoreText";
import CustomButton from "@components/kit/button/CustomButton";
import TextareaInput from "@components/kit/Input/TextareaInput";
// COMPONENT DYNAMIC IMPORT
const Login = dynamic(() => import("@components/common/login/Main"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });

export default function CapacityParticipation({
  projectId,
  lang,
  t,
  tPA,
  showDescription,
  descriptionOfParticipation,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const accounts = useSelector((state) => state.accounts.accounts);
  const currentUser = accounts.filter((i) => i._id === token?._id);
  const initialFormData = useSelector((state) => state.landingPage.formData);
  ///////////////////////APOLLO///////////////////////
  const [participate] = useMutation(PARTICIPATE_IN_PROJECT);
  ///////////////////////STATES///////////////////////
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    setDescription(initialFormData?.capacityDescription);
    if (token?._id && currentUser[0]?.name) {
      dispatch(
        landingPageAction({
          ...initialFormData,
          formData: null,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (error) {
      if (description === "") {
        setError(true);
      } else {
        setError(false);
      }
    }
  }, [error, description]);

  ///////////////////////FUNCTIONS///////////////////////
  const submit = async () => {
    const variables = {
      projectId: projectId,
      data: {
        title: description,
        categoryId: null,
        subcategoryId: null,
        levelId: null,
        description,
        type: "CAPACITY",
      },
    };
    if (description === "") {
      setError(true);
    } else {
      try {
        const {
          data: { participate_in_project },
        } = await participate({
          variables,
        });
        if (participate_in_project.status === 200) {
          setDescription("");
          router.push(
            {
              pathname: `/project-profile/${projectId}`,
            },
            undefined,
            { shallow: true }
          );
          saveToStorage("participationResult", 1);
        }
      } catch (error) {
        if (error.message === "Authorization failed" || error.message === "Token required") {
          dispatch(
            landingPageAction({
              url: router.asPath,
              formData: {
                ...initialFormData,
                capacityDescription: description,
              },
            })
          );
          setShowLogin(true);
        } else {
          router.push(
            {
              pathname: `/project-profile/${projectId}`,
            },
            undefined,
            { shallow: true }
          );
          saveToStorage("participationResult", 0);
          saveToStorage("participationType", "CAPACITY");
        }
      }
    }
  };
  return (
    <>
      <section
        className={`w-full px-4 pt-5 pb-[120px] 2xl:max-w-[1320px] 2xl:mx-auto ${
          showDescription ? " 2xl:mx-auto" : ""
        } `}
      >
        <header className="lg:hidden">
          <div className="pt-[14px] pb-[25px]">
            <h1 className="title4 pb-[10px] text-center">{tPA("capacityP")}</h1>
            {showDescription && (
              <ShowMoreText
                textAlign="text-center"
                text={descriptionOfParticipation}
                length={110}
              />
            )}
          </div>
        </header>
        <section className="lg:flex lg:items-center lg:gap-x-[30px] xl:gap-x-[60px] 2xl:gap-x-[70px] lg:mt-[55px] ">
          <div className="w-full h-[620px] relative hidden mx-auto lg:block">
            <Image
              src="/assets/images/capacity-participation-desktop.png"
              layout="fill"
              quality={100}
              unoptimized
              objectFit="cover"
              alt="capacity-participation"
              className=""
            ></Image>
          </div>

          <main className="flex flex-col items-center lg:w-[75%]">
            <div className="w-[328px] h-[252px] relative mx-auto lg:hidden">
              <Image
                src="/assets/images/capacity-participation-desktop.png"
                layout="fill"
                alt="capacity-participation"
                className=""
              ></Image>
            </div>
            <div className="w-full ltr:text-left rtl:text-right mb-[28px] hidden lg:block">
              <div className="flex ltr:flex-col rtl:flex-col-reverse">
                <h2 className="headingDesktop2">{t("requirements.capacity")}</h2>
                <h2 className="headingDesktop2">{t("donation")}</h2>
              </div>
              {showDescription && (
                <div
                  className="p-[14px] border-[1px] border-gray5 rounded-lg mt-[14px]"
                  dir={lang === "en" ? "rtl" : "ltr"}
                >
                  <h6 className="participationDesktop text-[20px] font-normal leading-[40px] max-h-[187px] overflow-y-auto px-[14px] ">
                    {descriptionOfParticipation}
                  </h6>
                </div>
              )}
            </div>
            <div className="w-full">
              <TextareaInput
                t={t}
                value={description}
                setValue={setDescription}
                errorText={error ? t("errorMessages.requiredField") : ""}
                maxLength={1000}
                characterCount={description?.length}
                showMaxLengthLabel={true}
                height="h-[187px]"
                labelText={t("description")}
                placeholder={tPA(
                  "participations-placeholder-description.capacity.placeholderDescription"
                )}
              />
            </div>

            <div className="px-4 lg:px-0 w-full fixed lg:static bottom-0 lg:mt-[30px] bg-white lg:bg-transparent shadow lg:shadow-none pb-5 pt-3 lg:pb-0 lg:pt-0">
              <CustomButton
                title={tPA("participateNow")}
                onClick={() => submit()}
                isFullWidth={true}
                size="M"
                isDisabled={description === "" || !description}
                isPointerEventsNone={description === "" || !description}
              />
            </div>
          </main>
        </section>
      </section>

      {showLogin && (
        <ModalScreen open={showLogin}>
          <Login setShowLogin={setShowLogin} modalMode={true} t={t} landingRoute={router.asPath} />
        </ModalScreen>
      )}
    </>
  );
}
