import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//COMPONENT
import ParticipationManagement from "@components/pages/participation-management/Main";

export default function ParticipationManagementPage({ params }) {
  const { t: tPM } = useTranslation("project-management");
  const { t: tHome } = useTranslation("home");
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{tPM("participationsManagement")}</title>
      </Head>
      <ParticipationManagement t={t} tPM={tPM} tHome={tHome} id={params.id} />
    </>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps({ params, locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "project-management", "home"])),
      params,
    },
  };
}
