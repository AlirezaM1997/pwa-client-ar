import Head from "next/head";
import { useTranslation } from "next-i18next";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//COMPONENT
import Header from "@components/common/Header";
import TransactionsSection from "@components/pages/wallet/TransactionsSection";

export default function TransactionsPage() {
  const { t } = useTranslation();
  const { t: tW } = useTranslation("wallet");

  return (
    <>
      <Head>
        <title>{tW("transactions")}</title>
      </Head>
      <Header title={tW("transactions")} onClick={() => history.back()} />
      <TransactionsSection t={t} tW={tW} />
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
