import Head from "next/head";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { useWindowSize } from "@uidotdev/usehooks";
import { ArrowLeft, ArrowRight } from "iconsax-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//GQL
import { ASSOCIATION_GET_FOLLOWERS } from "@services/gql/query/ASSOCIATION_GET_FOLLOWERS";
//COMPONENT
import Loading from "@components/kit/loading/Loading";
import SearchInput from "@components/kit/Input/SearchInput";
import FollowCard from "@components/pages/followers/FollowCard";
// COMPONENT DYNAMIC IMPORT
const NoResult = dynamic(() => import("@components/common/NoResult"), { ssr: false });

export default function FollowersPage() {
  const { t } = useTranslation();
  const lang = getCookie("NEXT_LOCALE");
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const size = useWindowSize();

  //FUNCTIONS
  const [getMyFollowers, { error, loading, data, refetch }] = useLazyQuery(
    ASSOCIATION_GET_FOLLOWERS,
    {
      variables: {
        page: 0,
        limit: 500,
      },
      fetchPolicy: "no-cache",
      onCompleted(data) {
        setResult(data?.association_get_followers?.users);
      },
    }
  );

  const fetchingMore = () => {
    getMyFollowers({ variables: { page: 0, limit: 200 } })
      .then(({ data }) => {
        setResult([
          ...result,
          ...(data?.association_get_followers?.users ? data.association_get_followers.users : null),
        ]);
      })
      .catch((e) => console.error("error", e));
  };

  const refetchCall = () => {
    refetch({ page: 0, limit: 200 })
      .then(({ data }) => {
        setResult(data.association_get_followers.users);
      })
      .catch((e) => console.error("error", e));
  };

  useEffect(() => {
    getMyFollowers();
  }, []);

  return (
    <>
      <NextSeo title={"mofidapp"} description={"mofidapp"} />
      <Head>
        <title>{t("myFollower")}</title>
      </Head>
      <section className="px-4 pt-6 pb-[100px] max-w-[1320px] 2xl:mx-auto">
        <SearchInput
          icon={
            lang === "en" ? (
              <ArrowLeft color="#7B808C" size={16} />
            ) : (
              <ArrowRight color="#7B808C" size={16} />
            )
          }
          buttonOnClick={() => history.back()}
          value={search}
          setValue={setSearch}
          isIconLeft={true}
        />
        <div>
          {!result ? (
            <div className="">
              <Loading
                loadingHeight={
                  size.width < 1320 ? `${size.height - 220}px` : `${size.height - 195}px`
                }
                loadingWidth={size.width < 1320 ? "w-full" : "w-[1320px]"}
              />
            </div>
          ) : result?.length === 0 ? (
            <NoResult />
          ) : (
            <InfiniteScroll
              dataLength={result?.length ?? 0}
              hasMore={false}
              next={fetchingMore}
              style={{ marginTop: "20px", overflow: "unset" }}
            >
              <div className="">
                {result?.map((item, index) => {
                  return (
                    <div key={index} className="my-[40px]">
                      <FollowCard data={item} t={t} refetchCall={refetchCall} />
                    </div>
                  );
                })}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </section>
    </>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
