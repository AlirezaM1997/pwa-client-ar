import Head from "next/head";
import { NextSeo } from "next-seo";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//COMPONENT
import Layout from "@components/pages/landing/Layout";
import SendLink from "@components/pages/landing/SendLink";
import CustomButton from "@components/kit/button/CustomButton";
import HelpingSection from "@components/pages/landing/HelpingSection";
import BenefitsSection from "@components/pages/landing/BenefitsSection";

export default function LandingPage() {
  ///////////////////////HOOKS///////////////////////
  const { t } = useTranslation();
  const { t: tLanding } = useTranslation("landing");
  const router = useRouter();

  ///////////////////////JSX///////////////////////
  return (
    <>
      <NextSeo title={"mofidapp"} description={"mofidapp"} />
      <Head>
        <title>{tLanding("landing")}</title>
      </Head>
      <Layout t={t} tLanding={tLanding}>
        <div className="landingTopStyle absolute top-0 w-full h-[890px] lg:h-[865px] -z-[1] rounded-b-[800px] lg:max-w-[1320px] 2xl:mx-auto"></div>
        <section className="lg:px-[30px] mt-[22px] lg:mt-16 lg:max-w-[1320px] flex items-start gap-x-[9px] lg:gap-x-5 ltr:pl-2 ltr:pr-4">
          <div className={`w-[36px] lg:w-[41px] h-[31px] lg:h-[36px] relative`}>
            <Image src={"/assets/svg/landing/landingDots.svg"} layout="fill" alt={"logo"}></Image>
          </div>
          <div>
            <h1 className="relative text-[22px] font-bold leading-9 lg:text-[34px] lg:font-bold lg:leading-9 -z-[1] before:absolute before:w-[98px] before:lg:w-[98px] before:h-[11px] before:bg-main4 before:top-1/4 before:lg:top-1/2 before:-translate-y-1/2 before:-z-[2]">
              {tLanding("heroHead")}
            </h1>
            <h6 className="mt-[11px] mb-[18px] lg:my-[22px] lg:text-[22px] lg:font-medium lg:leading-[40px] lg:max-w-[730px]">
              {tLanding("heroDes")}
            </h6>
            <CustomButton
              onClick={() => {
                router.push("/login", undefined, { shallow: true });
              }}
              size="M"
              title={tLanding("logToApp")}
              styleType="Secondary"
              borderColor="border-main1"
              textColor="text-main1"
              paddingX="p-6"
            />
          </div>
        </section>
        <section className="lg:px-[68px] mt-[45px] lg:mt-[74px] lg:max-w-[1320px]">
          <SendLink tLanding={tLanding} t={t} />
        </section>
        <section className="mt-[160px] lg:mt-[250px] lg:mb-[108px] relative">
          <div className="hidden lg:block absolute ltr:lg:left-[10%] rtl:lg:right-[10%] lg:bottom-[80%]">
            <div className="relative w-[30px] h-[30px] lg:w-[90px] lg:h-[90px] left-2 -bottom-3 lg:-bottom-4 lg:-left-6">
              <Image
                src={"/assets/svg/landing/blue-circle-2.svg"}
                layout="fill"
                alt="SendLink-image"
              />
            </div>
          </div>
          {/* <h4 className="text-center text-gray3 w-[200px] lg:w-full mx-auto">
            {tLanding("trustedDes")}
          </h4> */}
          <div className="grid grid-cols-2 gap-3 lg:gap-0 justify-items-center lg:flex lg:justify-between w-full px-4 mt-[40px] lg:mt-[65px]">
            <a href={"https://bit.ly/mofidapp-apk"} rel="noreferrer" target="_blank">
              <div className={`w-[147px] lg:w-[214px] h-[39px] lg:h-[55px] relative`}>
                <Image
                  src={"/assets/images/landing/directDownload-active.png"}
                  layout="fill"
                  alt={"direct-download"}
                ></Image>
              </div>
            </a>
            <a href={"https://mofidapp.com"} rel="noreferrer" target="_blank">
              <div className={`w-[147px] lg:w-[186px] h-[39px] lg:h-[55px] relative`}>
                <Image
                  src={"/assets/images/landing/web-active.png"}
                  layout="fill"
                  alt={"pwa"}
                ></Image>
              </div>
            </a>
            <div className=" cursor-pointer">
              <div className={`w-[147px] lg:w-[184px] h-[39px] lg:h-[55px] relative`}>
                <Image
                  src={"/assets/images/landing/appStore-unactive.png"}
                  layout="fill"
                  alt={"app-store"}
                ></Image>
              </div>
            </div>
            <a
              href={"https://play.google.com/store/apps/details?id=com.mofid.app"}
              rel="noreferrer"
              target="_blank"
            >
              <div className={`w-[147px] lg:w-[184px] h-[39px] lg:h-[55px] relative`}>
                <Image
                  src={"/assets/images/landing/googlePlay-active.png"}
                  layout="fill"
                  alt={"googlePlay"}
                ></Image>
              </div>
            </a>
          </div>
        </section>
        <section className="px-4 mt-[46px] lg:mt-[146px] mb-[54px] lg:mb-[138px]">
          <HelpingSection tLanding={tLanding} t={t} />
        </section>
        <section className="">
          <BenefitsSection tLanding={tLanding} />
        </section>
      </Layout>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["landing", "common"])),
    },
  };
}
