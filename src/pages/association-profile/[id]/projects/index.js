import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useTranslation } from "next-i18next";
import { SearchNormal1 } from "iconsax-react";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//COMPONENT
import BackButton from "@components/common/BackButton";
import AssociationProjects from "@components/pages/association-profile/AssociationProjects";

export default function Projects() {
  const router = useRouter();
  const { t } = useTranslation();
  const { t: tHome } = useTranslation("home");
  const [search, setSearch] = useState("");
  const lang = getCookie("NEXT_LOCALE");

  return (
    <>
      <Head>
        <title>{t("associationProjects")}</title>
      </Head>
      <div className="bg-white pt-5 pb-20 2xl:w-[1320px] 2xl:m-auto">
        <div className="lg:hidden w-full flex items-center mt-[10px] px-4 gap-x-2">
          <BackButton
            onClick={() => router.back()}
            dir={["Ar", "ar"].includes(lang) ? "right" : "left"}
          />
          <div className=" h-[38px] flex items-center  rounded-[24px] bg-gray6 w-full">
            <input
              className={`w-full h-[33px] py-[11px] pr-3 ltr:pl-3 pl-[15px] ltr:pr-[35px] text1222400 rounded-[24px] bg-gray6 outline-none `}
              placeholder={tHome("searchInProjects")}
              autoComplete="off"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <div className={`absolute ltr:right-[25px] rtl:left-[25px] px-1`}>
              <SearchNormal1 color="#7B808C" size="16" />
            </div>
          </div>
        </div>
        <AssociationProjects t={t} />
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
export const getStaticProps = async ({ params, locale }) => {
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["common", "home"])),
      params,
    },
  });
};
