import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { addApolloState, initializeApollo } from "@services/apollo-client";
//COMPONENT
import Header from "@components/common/Header";

export default function TermsPage() {
  const { t: tT } = useTranslation("terms");

  return (
    <>
      <Head>
        <title>{tT("terms")}</title>
      </Head>
      <section
        className="2xl:mx-auto 2xl:w-[1320px]"
        style={{ direction: "rtl", textAlign: "right" }}
      >
        <Header onClick={() => history.back()} title={tT("terms")} />
        <div className="pt-[28px] pb-8 px-4 flex flex-col gap-y-3">
          <h1 className="heading">{tT("terms")}</h1>
          <h1 className="title1">{tT("termsDes1")}</h1>
          <h1 className="title1">{tT("termsDes2")}</h1>
          <h1 className="title1">{tT("termsDes3")}</h1>
          <p className="title1">{tT("termsDes4")}</p>
        </div>
      </section>
    </>
  );
}
export async function getStaticProps({ locale }) {
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["terms"])),
    },
  });
}
