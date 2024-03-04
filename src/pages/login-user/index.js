import Head from "next/head";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//COMPONENT DYNAMIC IMPORT
const Login = dynamic(() => import("@components/common/login/Main"), {
  ssr: false,
});

export default function UserLoginPage() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("login.title")}</title>
      </Head>
      <Login t={t} landingRoute={"/guide/site-description"} justUser={true}/>
    </>
  );
}
export const getStaticProps = async ({ locale }) => {
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  });
};
