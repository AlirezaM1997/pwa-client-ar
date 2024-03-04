import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { addApolloState, initializeApollo } from "@services/apollo-client";
//COMPONENT
import Header from "@components/common/Header";
import AccountsSection from "@components/pages/wallet/AccountsSection";

export default function AccountsPage() {
  const { t } = useTranslation();
  const { t: tW } = useTranslation("wallet");

  return (
    <>
      <Head>
        <title>{tW("accounts")}</title>
      </Head>
      <Header onClick={() => history.back()} title={tW("accounts")} />

      <AccountsSection tW={tW} t={t}/>

    </>
  );
}
export async function getStaticProps({ locale }) {
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["common", "wallet"])),
    },
  });
}
