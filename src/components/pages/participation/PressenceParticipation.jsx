import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { saveToStorage } from "@functions/saveToStorage";
//GQL
import { PARTICIPATE_IN_PROJECT } from "@services/gql/mutation/PARTICIPATE_IN_PROJECT";
import { GET_SINGLE_PROJECT_MY_PARTICIPATIONS } from "@services/gql/query/GET_SINGLE_PROJECT_MY_PARTICIPATIONS";
//COMPONENT
import ShowMoreText from "@components/common/ShowMoreText";
import CustomButton from "@components/kit/button/CustomButton";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const Login = dynamic(() => import("@components/common/login/Main"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });

export default function PressenceParticipation({
  projectId,
  t,
  tPA,
  showDescription,
  lang,
  descriptionOfParticipation,
}) {
  //VARIABLE
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [myParticipationList, setMyParticipationList] = useState([]);

  //API
  const [participate] = useMutation(PARTICIPATE_IN_PROJECT);
  const getSingleProject = useQuery(GET_SINGLE_PROJECT_MY_PARTICIPATIONS, {
    variables: {
      id: projectId,
    },
    fetchPolicy: "no-cache",
  });

  //FUNCTION
  useEffect(() => {
    if (getSingleProject.data) {
      setMyParticipationList(
        getSingleProject.data.getSingleProject.myParticipations.filter(
          (i) => i.type === "PRESSENCE"
        )
      );
    }
  }, [getSingleProject.data]);

  const submit = async () => {
    const variables = {
      projectId: projectId,
      data: {
        title: null,
        categoryId: null,
        subcategoryId: null,
        levelId: null,
        description: null,
        type: "PRESSENCE",
      },
    };
    try {
      const {
        data: { participate_in_project },
      } = await participate({
        variables,
      });
      if (participate_in_project.status === 200) {
        router.push(
          {
            pathname: `/project-profile/${projectId}`,
          },
          undefined,
          { shallow: true }
        );
        saveToStorage("participationResult", 1);
        getSingleProject.refetch();
      }
    } catch (error) {
      if (error.message === "Authorization failed" || error.message === "Token required") {
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
        saveToStorage("participationType", "PRESSENCE");
      }
    }
  };

  //JSX
  if (getSingleProject.loading) return <LoadingScreen />;
  return (
    <>
      <section
        className={`w-full px-4 pt-5 pb-[120px] 2xl:max-w-[1320px] 2xl:mx-auto ${
          showDescription ? " 2xl:mx-auto" : ""
        } `}
      >
        <header className="lg:hidden">
          <div className="pt-[14px] pb-[25px]">
            <h1 className="title4 pb-[10px] text-center">{tPA("pressenceP")}</h1>
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
          <div className="w-full h-[622px] relative hidden mx-auto lg:block">
            <Image
              src="/assets/images/pressence-participation.png"
              layout="fill"
              quality={100}
              objectFit="cover"
              alt="pressence-participation"
              unoptimized
            ></Image>
          </div>
          <main className="flex flex-col items-center lg:w-[75%]">
            <div className="w-[328px] h-[290px] relative mx-auto lg:hidden">
              <Image
                src="/assets/images/pressence-participation.png"
                layout="fill"
                alt="pressence-participation"
                className=""
              ></Image>
            </div>
            <div className="w-full ltr:text-left rtl:text-right mb-16 hidden lg:block">
              <div className="flex ltr:flex-col rtl:flex-col-reverse">
                <h2 className="headingDesktop2">{t("requirements.pressence")}</h2>
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
            <div className="px-4 lg:px-0 w-full fixed lg:static bottom-0 lg:mt-[100px] bg-white lg:bg-transparent shadow lg:shadow-none pb-5 pt-3 lg:pb-0 lg:pt-0">
              <CustomButton
                title={tPA("participateNow")}
                onClick={
                  myParticipationList.length === 0
                    ? () => submit()
                    : () =>
                        toast.custom(() => (
                          <Toast text={tPA("pressenceParticipationAgainWarning")} />
                        ))
                }
                isFullWidth={true}
                size="M"
                isDisabled={myParticipationList.length !== 0}
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
