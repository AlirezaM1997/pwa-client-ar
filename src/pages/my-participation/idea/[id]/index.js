import Head from "next/head";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useLazyQuery } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { GET_PARTICIPATIONS_RECEIPT } from "@services/gql/query/GET_PARTICIPATIONS_RECEIPT";
//COMPONENT
import BackButton from "@components/common/BackButton";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import ReceiptCard from "@components/common/ReceiptCard";
// COMPONENT DYNAMIC IMPORT
const Login = dynamic(() => import("@components/common/login/Main"), { ssr: false });
const NoResult = dynamic(() => import("@components/common/NoResult"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });

const limit_item = 10;

export default function ParticipationPage({ params }) {
  const { t } = useTranslation();
  const { t: tPA } = useTranslation("participation");
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [participations, setParticipations] = useState([]);
  const [page, setPage] = useState(0);

  const [getParticipationsReceipt, { loading, error, data, fetchMore }] = useLazyQuery(
    GET_PARTICIPATIONS_RECEIPT,
    {
      variables: {
        projectId: `${params?.id}`,
        page: 0,
        limit: limit_item,
        participationType: ["IDEAS"],
      },
    }
  );

  useEffect(() => {
    toast.remove();
    if (!data && page === 0) getParticipationsReceipt();
    if (data && page === 0) {
      setParticipations(data.get_participations_receipt.result);
      setPage(1);
    }
  }, [data]);

  useEffect(() => {
    if (error?.message === "Authorization failed" || error?.message === "Token required") {
      setShowLogin(true);
    }
  }, [error]);

  const fetchingMore = () => {
    if (!data) return;
    fetchMore({ variables: { page } })
      .then(({ data }) => {
        setParticipations([
          ...participations,
          ...(data?.get_participations_receipt.result || null),
        ]);
        setPage(page + 1);
      })
      .catch((e) => console.log("error", e));
  };

  const total = data?.get_participations_receipt.total ?? 0;

  if (loading || (!data && !error)) return <LoadingScreen />;
  return (
    <>
      <div className="px-4">
        <Head>
          <title>{tPA("myParticipations.donateList")}</title>
        </Head>
        <header className="pt-5 pb-[22px] relative">
          <div className="absolute">
            <BackButton
              onClick={() => router.back()}
              dir={["Ar", "ar"].includes(lang) ? "right" : "left"}
            />
          </div>
          <h1 className="text-center text-black heading">{tPA("myParticipations.donateList")}</h1>
        </header>
        <main className="flex flex-col gap-[20px] mb-[48px]">
          <InfiniteScroll
            dataLength={participations?.length ?? 0}
            hasMore={limit_item * page < total}
            next={fetchingMore}
            style={{ overflow: "unset" }}
            className="lg:grid lg:grid-cols-2 lg:gap-4"
          >
            {participations.map((item, index) => {
              return (
                <ReceiptCard t={t} tPA={tPA} receipt={item} key={"ParticipationCard" + index} />
              );
            })}
          </InfiniteScroll>

          {participations?.length === 0 && <NoResult />}
        </main>
      </div>
      {showLogin && (
        <ModalScreen open={showLogin}>
          <Login setShowLogin={setShowLogin} modalMode={true} t={t} landingRoute={router.asPath} />
        </ModalScreen>
      )}
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
      ...(await serverSideTranslations(locale, ["participation", "common"])),
      params,
    },
  };
};
