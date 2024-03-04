import Head from "next/head";
import { useTranslation } from "next-i18next";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/legacy/image";
import { useSelector } from "react-redux";
import CustomButton from "@components/kit/button/CustomButton";
import { useRouter } from "next/router";

export default function SiteDescription() {
  const router = useRouter()
  const { t: tGuide } = useTranslation("guide");
  const isUser = useSelector((state) => state.isUser.isUser);

  return (
    <>
      <Head>
        <title>{tGuide("siteDescription.title")}</title>
      </Head>
      <section className="pt-[28px] px-4 lg:px-[30px]">
        <div className="w-full h-[175px] lg:h-[321px] flex items-center justify-center bg-main9 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="relative w-[48px] h-[83px] lg:w-[83px] lg:h-[148px]">
              <Image src="/assets/images/group-site-info.png" layout="fill" alt="group-site-info" ></Image>
            </div>
            <div className="w-full h-[1px] gradient1"></div>
            <span className="text-main2 caption4 lg:captionDesktop2 lg:font-normal">{tGuide("siteDescription.subTitle")}</span>
            <div className="mt-1 w-full h-[1px] gradient2"></div>
          </div>
        </div>
        <div className="rtl:-ml-4 ltr:-mr-4 mt-[7px] lg:mt-[36px] mb-[7px] lg:mb-4 flex items-end">
          <div className="relative">
            <h4 className="text-black captionDesktop4 font-bold lg:headingDesktop lg:leading-[34px]">
              {tGuide("siteDescription.introducingPlatform")}
            </h4>
            <span className="bg-main6 absolute top-[15px] rtl:left-0 ltr:right-0 w-[30px] h-[7px]"></span>
          </div>
          <div className="relative w-[260px] h-[42px] lg:w-[294px] lg:h-[50px]">
            <Image src="/assets/images/rope.png" layout="fill" alt="rope"></Image>
          </div>
        </div>
        <p className="caption1 text-gray-800 mb-[40px] lg:mb-[60px] lg:captionDesktop2 text-justify">
          {tGuide("siteDescription.platformDescription")}
        </p>
        <div className="flex justify-center items-center bg-main9 w-full h-[175px] mb-[11px] lg: mb-[19px] lg:h-[321px]">
          <div className="relative w-[84px] h-[108px] lg:w-[132px] lg:h-[170px]">
            <Image src={isUser ? "/assets/images/coins.png" : "/assets/images/create-project2.png"} layout="fill" alt="image" />
          </div>
        </div>
        <Image src="/assets/images/shot-lines.png" alt="shot-lines" width="25" height="24px" className="trandform -rotate-[8deg]" />
        <h4 className="text-black captionDesktop4 font-bold lg:headingDesktop lg:leading-[34px] mb-2 lg:mb-4">{isUser ? tGuide("siteDescription.participationInProjects") : tGuide("siteDescription.createProject")}</h4>
        <p className="caption1 mb-[36px] lg:mb-[76px] lg:captionDesktop2 text-gray-800 text-justify">{isUser ? tGuide("siteDescription.participationInProjectsDescription") : tGuide("siteDescription.createProjectDescription")}</p>
        <div className="sticky bottom-0 py-[19px] border-t border-gray-200 bg-white flex -mx-4 px-4">
          <CustomButton
            classNames="flex-grow ltr:mr-[5px] rtl:ml-[5px] py-[10px] h-max"
            title={tGuide("siteDescription.viewPlatform")}
            styleType="Secondary"
            textColor="text-[#03A6CF]"
            onClick={() => router.push("/")}
          />
          <CustomButton
            classNames="flex-grow ltr:ml-[5px] rtl:mr-[5px] py-[10px] h-max"
            title={isUser ? tGuide("siteDescription.participationInTheProject") : tGuide("siteDescription.createProject")}
            onClick={() => isUser ? router.push(
              {
                pathname: "/search",
                query: { search: "", source: "project", sort: "LATEST" },
              },
              undefined,
              { shallow: true }
            ) : router.push("/create-form")}
          />
        </div>
      </section>
      <style>
        {`
          .gradient1 {background: linear-gradient(90deg, #FFC632 0%, #03A6CF 60.4%, #03A6CF 100%);}
          .gradient2 {background: linear-gradient(90deg, #03A6CF 0%, #03A6CF 60.4%, #FFC632 100%);}
        `}
      </style>
    </>
  );
}
export async function getStaticProps({ locale }) {
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["guide", "common"])),
    },
  });
}