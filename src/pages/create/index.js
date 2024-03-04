import Head from "next/head";
import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import {
  ArrowCircleLeft2,
  ArrowCircleRight2,
  ArrowLeft,
  ArrowRight,
  DocumentText1,
} from "iconsax-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//COMPONENT
import BackButton from "@components/common/BackButton";
import CustomButton from "@components/kit/button/CustomButton";
// COMPONENT DYNAMIC IMPORT
const Login = dynamic(() => import("@components/common/login/Main"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });

export default function CreatePage() {
  const { t } = useTranslation();
  const lang = getCookie("NEXT_LOCALE");
  const currentUserId = useSelector((state) => state.token._id);
  const isUser = useSelector((state) => state.isUser.isUser);
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);

  const handleCreateProjectClick = () => {
    if (!currentUserId) {
      router.push({
        pathname: "/login",
        query: { association: true, landingRoute: "/create-form" },
      });
    } else {
      router.push("/create-form", undefined, { shallow: true });
    }
  };

  const handleCreateRequestClick = () => {
    if (!currentUserId) {
      router.push({
        pathname: "/login",
        query: { user: true, landingRoute: "/create-form" },
      });
    } else {
      router.push("/create-form", undefined, { shallow: true });
    }
  };

  return (
    <>
      <Head>
        <title>{t("create.create")}</title>
      </Head>
      <section className="pt-6 pb-[100px]">
        <div className="px-4 flex ltr">
          <BackButton
            onClick={() => history.back()}
            icon={
              lang == "ar" ? (
                <ArrowRight color="#7B808C" size={"16"} />
              ) : (
                <ArrowLeft color="#7B808C" size={"16"} />
              )
            }
          />
        </div>
        <div className="flex justify-center mt-[10px]  flex-col items-center px-[22px]">
          <div className="w-[28px] h-[28px] mb-[10px] relative">
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                backgroundColor: "#DDF3F9",
                zIndex: "-1",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <DocumentText1 size="36" color="#03A6CF" />
            </div>
          </div>
          <h1 className="heading pt-[30px] pb-[11px]">{t("create.title")}</h1>
          <div
            onClick={handleCreateProjectClick}
            className={`${
              isUser && currentUserId ? "pointer-events-none" : ""
            } px-[14px] py-3 border-[1px] border-gray5 rounded-2xl w-full mt-5`}
          >
            <p className={`${isUser && currentUserId ? "text-gray1" : ""} title2 `}>
              {t("createProject")}
            </p>
            <p
              className={`${
                isUser && currentUserId ? "text-gray2" : ""
              } caption3 pt-[3px] pb-[9px]`}
            >
              {t("create.createProjectDes")}
            </p>
            <div style={{ display: "flex", direction: "row", justifyContent: "end" }}>
              <CustomButton
                onClick={() => null}
                bgColor="bg-main2"
                paddingX="p-4"
                title={t("create.createProject")}
                icon={
                  lang == "ar" ? (
                    <ArrowCircleLeft2 variant="Bold" />
                  ) : (
                    <ArrowCircleRight2 variant="Bold" />
                  )
                }
                isIconLeftSide={lang == "ar" ? false : true}
                isDisabled={isUser && currentUserId ? true : false}
              />
            </div>
          </div>
          {
            <div
              onClick={handleCreateRequestClick}
              className={`${
                !isUser && currentUserId ? "pointer-events-none" : ""
              } px-[14px] py-3 border-[1px] border-gray5 rounded-2xl w-full mt-8`}
            >
              <p className={`${!isUser && currentUserId ? "text-gray1" : ""} title2`}>
                {t("createRequest")}
              </p>
              <p
                className={`${
                  !isUser && currentUserId ? "text-gray2" : ""
                } caption3 pt-[3px] pb-[9px]`}
              >
                {t("create.createRequestDes")}
              </p>
              <div style={{ display: "flex", direction: "row", justifyContent: "end" }}>
                <CustomButton
                  onClick={() => null}
                  bgColor="bg-main2"
                  paddingX="p-4"
                  title={t("create.createRequest")}
                  icon={
                    lang == "ar" ? (
                      <ArrowCircleLeft2 variant="Bold" />
                    ) : (
                      <ArrowCircleRight2 variant="Bold" />
                    )
                  }
                  isIconLeftSide={lang == "ar" ? false : true}
                  isDisabled={!isUser && currentUserId ? true : false}
                />
              </div>
            </div>
          }
        </div>
      </section>
      {showLogin && (
        <ModalScreen open={showLogin}>
          <Login setShowLogin={setShowLogin} modalMode={true} t={t} landingRoute={"/create"} />
        </ModalScreen>
      )}
    </>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
