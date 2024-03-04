import Head from "next/head";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//COMPONENT DYNAMIC IMPORT
const ActionsManagement = dynamic(() => import("@components/pages/actions-management/Main"), {
  ssr: false,
});

export default function ActionsManagementPage() {
  const { t } = useTranslation();
  const { t: tHome } = useTranslation("home");
  const isUser = useSelector((state) => state.isUser.isUser);

  return (
    <>
      <Head>
        <title>{t("actions")}</title>
      </Head>
      <ActionsManagement t={t} tHome={tHome} isUser={isUser} />
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "home"])),
    },
  };
}
