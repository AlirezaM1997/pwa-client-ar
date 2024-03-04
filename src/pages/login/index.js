import Head from "next/head";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
//COMPONENT DYNAMIC IMPORT
const Login = dynamic(() => import("@components/common/login/Main"), {
  ssr: false,
});

export default function LoginPage() {
  const router = useRouter()
  const { t } = useTranslation();
  const landingRoute = router.query.landingRoute ||"/my-profile"
  

  return (
    <>
      <Head>
        <title>{t("login.title")}</title>
      </Head>
      <Login t={t} landingRoute={landingRoute} />
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
