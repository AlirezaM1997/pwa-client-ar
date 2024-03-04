import Head from "next/head";
import { useTranslation } from "next-i18next";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//COMPONENT
import Header from "@components/common/Header";
import WithdrawlSection from "@components/pages/wallet/WithdrawlSection";

export default function WithdrawalPage() {
  const { t } = useTranslation();
  const { t: tW } = useTranslation("wallet");

  return (
    <>
      <Head>
        <title>{tW("withdrawal")}</title>
      </Head>

      <Header
        onClick={() => {
          history.back();
        }}
        title={tW("withdrawal")}
      />
      <WithdrawlSection t={t} tW={tW} />
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
