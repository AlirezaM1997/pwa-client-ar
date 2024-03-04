import Head from "next/head";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { ArrowLeft, ArrowRight, DirectboxNotif } from "iconsax-react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { GET_SINGLE_PROJECT } from "@services/gql/query/GET_SINGLE_PROJECT";
//COMPONENT
import LoadingScreen from "@components/kit/loading/LoadingScreen";
// COMPONENT DYNAMIC IMPORT
const CapacityParticipation = dynamic(
  () => import("@components/pages/participation/CapacityParticipation"),
  {
    ssr: false,
  }
);

export default function CapacityParticipationPage({ params }) {
  ///////////////////////HOOKS///////////////////////
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();
  const projectId = params.id;
  const { t } = useTranslation();
  const { t: tPA } = useTranslation("participation");
  const [participationId, setParticipationId] = useState(null);

  ///////////////////////APOLLO///////////////////////
  const { data, loading, error } = useQuery(GET_SINGLE_PROJECT, {
    variables: {
      id: params.id,
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    setParticipationId(router.query?.participationID);
  }, [data]);

  if (loading || !participationId) return <LoadingScreen />;
  return (
    <>
      <Head>
        <title>{tPA("capacityP")}</title>
      </Head>
      <div className="flex justify-between px-4 pt-7 lg:hidden">
        <div
          onClick={() => {
            router.back();
            toast.remove();
          }}
          className="bg-[#03A7CC14] rounded-full w-8 h-8 flex items-center justify-center"
        >
          {lang === "en" ? (
            <ArrowLeft fill="#03A6CF" color="#03A6CF" />
          ) : (
            <ArrowRight fill="#03A6CF" color="#03A6CF" />
          )}
        </div>
        <div
          className="bg-[#03A7CC14] rounded-full w-8 h-8 flex items-center justify-center"
          onClick={() => {
            toast.remove();
            router.push(`/my-participation/valency/${projectId}`, undefined, { shallow: true });
          }}
        >
          <DirectboxNotif fill="#03A6CF" color="#03A6CF" />
        </div>
      </div>
      <div className="hidden lg:inline-block mx-8 mt-6">
        <div
          className="bg-[#03A7CC14] rounded-full w-10 h-10 hidden lg:flex  items-center justify-center  cursor-pointer"
          onClick={() => {
            toast.remove();
            router.push(`/my-participation/valency/${projectId}`, undefined, { shallow: true });
          }}
        >
          <DirectboxNotif fill="#03A6CF" color="#03A6CF" />
        </div>
      </div>
      <CapacityParticipation
        t={t}
        tPA={tPA}
        projectId={params.id}
        lang={lang}
        showDescription={true}
        descriptionOfParticipation={
          data.getSingleProject.requirements.filter((i) => i._id === participationId)[0]
            ?.description
        }
      />
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
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "participation"])),
      params,
    },
  };
};
