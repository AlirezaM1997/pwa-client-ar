import Head from "next/head";
import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { toast } from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "@uidotdev/usehooks";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { ADD_EMAIL } from "@services/gql/mutation/ADD_EMAIL";
//COMPONENT
import Layout from "@components/pages/landing/Layout";
import PlainInput from "@components/kit/Input/PlainInput";
import CustomButton from "@components/kit/button/CustomButton";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });

export default function AboutPage() {
  const { t } = useTranslation();
  const { t: tLanding } = useTranslation("landing");
  const [email, setEmail] = useState("");
  const [activeBtn, setActiveBtn] = useState(false);
  const size = useWindowSize();
  const [setName_mutation] = useMutation(ADD_EMAIL);

  const handleSubscribe = async () => {
    try {
      const {
        data: { add_email_data },
      } = await setName_mutation({
        variables: {
          email,
        },
      });
      if (add_email_data.status === 200) {
        toast.custom(() => <Toast text={tLanding("aboutPage.subscribeSuccessful")} />, {
          duration: 800,
        });
        setEmail("");
        setActiveBtn(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validateEmail = (mail) => {
    // eslint-disable-next-line no-useless-escape
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) setActiveBtn(true);
    else setActiveBtn(false);
  };

  return (
    <>
      <Head>
        <title>{t("about")}</title>
      </Head>
      <Layout t={t} tLanding={tLanding}>
        <header className="relative flex items-center gap-x-[9px] mt-[16px] lg:mt-[75px] ltr:pl-1 ltr:pr-4 rtl:pl-4 rtl:pr-1">
          <div className={`w-[41px] h-[36px]  relative`}>
            <Image src={"/assets/svg/landing/landingDots.svg"} layout="fill" alt={"logo"}></Image>
          </div>
          <h1
            className={`relative text-[22px] font-bold leading-9 lg:text-[24px] lg:leading-[40px] before:absolute before:w-[98px] before:lg:w-[98px] before:h-[11px] before:bg-main4 ${
              size.width < 477 ? "before:top-1/4" : "before:top-1/2"
            }  before:-translate-y-1/2 before:-z-[1]`}
          >
            {tLanding("aboutPage.title")}
          </h1>
          <div
            className={`${
              size.width < 477
                ? "absolute right-3 top-11 w-[135px] h-[20px]"
                : size.width > 477 && size.width < 823
                ? "hidden"
                : "relative w-[340px] h-[50px]"
            }`}
          >
            <Image src={"/assets/svg/landing/helpingPath.svg"} layout="fill" alt="helpingPath" />
          </div>
        </header>
        <article className="mt-[20px] lg:mt-[44px] px-4">
          <p className="text-justify caption1 leading-[30px] lg:text-[20px] lg:font-medium lg:leading-[40px]">
            {tLanding("aboutPage.description")}
          </p>
          <div className="flex flex-col lg:flex-row lg:gap-x-[95px] lg:justify-center items-center mt-[60px]">
            <div className={`w-[212px] lg:w-[271px] h-[208px] lg:h-[265px] relative`}>
              <Image
                src={"/assets/images/landing/subscribe.png"}
                layout="fill"
                alt={"subscribe"}
              ></Image>
            </div>
            <div>
              <div className="flex items-center gap-x-[6px] mt-9 mb-[10px]">
                <div className={`w-[28px] h-[24px] relative`}>
                  <Image
                    src={"/assets/images/landing/shine.png"}
                    layout="fill"
                    alt={"shine"}
                  ></Image>
                </div>
                <h1 className="text-[18px] font-bold leading-[22px] lg:text-[28px] lg:font-semibold lg:leading-[40px]">
                  {tLanding("aboutPage.subscribeTitle")}
                </h1>
              </div>
              <h5 className="caption1 leading-[30px] lg:text-[26px] lg:font-normal lg:leading-[40px]">
                {tLanding("aboutPage.subscribeDes")}
              </h5>
              <div className="flex items-center gap-x-2 w-full mt-[26px]">
                <div className="w-full">
                  <PlainInput
                    value={email}
                    setValue={setEmail}
                    placeholder={t("email")}
                    hasMarginBottom={false}
                    onChange={(e) => {
                      validateEmail(e.target.value);
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <CustomButton
                  title={t("send")}
                  paddingX={size.width < 960 ? "px-3" : "px-[39px]"}
                  size={size.width < 960 ? "S" : "M"}
                  onClick={() => handleSubscribe()}
                  isDisabled={!activeBtn}
                  isPointerEventsNone={!activeBtn}
                />
              </div>
            </div>
          </div>
        </article>
      </Layout>
    </>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "landing"])),
    },
  };
}
