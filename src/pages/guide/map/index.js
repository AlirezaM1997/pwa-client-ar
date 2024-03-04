import Head from "next/head";
import dynamic from "next/dynamic";
import { useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { GET_ROOT_SUBJECTS } from "@services/gql/query/GET_ROOT_SUBJECTS";
//COMPONENT
import Header from "@components/common/Header";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
// COMPONENT DYNAMIC IMPORT
const InfoTable = dynamic(() => import("@components/pages/guide/InfoTable"), { ssr: false });

export default function GuidePage() {
  const { loading, data } = useQuery(GET_ROOT_SUBJECTS);
  const { t: tGuide } = useTranslation("guide");
  const { t } = useTranslation();

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Head>
        <title>{tGuide("map.mapGuide")}</title>
      </Head>
      <section>
        <Header onClick={() => history.back()} title={tGuide("map.mapGuide")} />

        <div className="pt-[7px] lg:pt-[10px] px-4">
          <div className="">
            <h1 className={`heading pb-1`}>{tGuide("map.projectStatus")}</h1>
            <p className={`caption2`}>{tGuide("map.projectStatusDes")}</p>
          </div>
          <div className="pt-5 w-full">
            <InfoTable
              array={[
                {
                  title: t("activeProject"),
                  icon: <span className="w-full h-full bg-main2"></span>,
                },
                {
                  title: t("pausedProject"),
                  icon: <span className="w-full h-full bg-gray4"></span>,
                },
                {
                  title: t("archivedProject"),
                  icon: <span className="w-full h-full bg-map"></span>,
                },
              ]}
            />
          </div>
        </div>
      </section>
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
