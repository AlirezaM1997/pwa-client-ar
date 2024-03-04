import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useEffect, useReducer } from "react";
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { SearchNormal1 } from "iconsax-react";
import { useWindowSize } from "@uidotdev/usehooks";
import InfiniteScroll from "react-infinite-scroll-component";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { convertArabicToGregorian } from "@functions/convertArabicToGregorian";
//FUNCTION
import { saveToStorage } from "@functions/saveToStorage";
import { getJsonFromUrl } from "@functions/getJsonFromUrl";
import { getFromStorage } from "@functions/getFromStorage";
//GQL
import { GET_CAMPAIGN_PROJECTS_LIST } from "@services/gql/query/GET_CAMPAIGN_PROJECTS_LIST";
//COMPONENT
import BackButton from "@components/common/BackButton";
import SearchFilterBadges from "@components/pages/search/SearchFilterBadges";
import ProjectCardSkeleton from "@components/kit/card/project-card-skeleton/Main";
//COMPONENT DYNAMIC IMPORT
const NoResult = dynamic(() => import("@components/common/NoResult"), { ssr: false });
const ProjectCard = dynamic(() => import("@components/kit/card/project-card/Main"), { ssr: false });

const initialState = {
  page: 0,
  filters: {},
  limit: null,
  result: null,
  fakeLoading: false,
  SearchInputMobileSize: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SearchInputMobileSize":
      return {
        ...state,
        SearchInputMobileSize: action.payload,
      };
    case "resultWithPageIncrease":
      return {
        ...state,
        result: action.payload,
        page: state.page + 1,
      };
    case "resultWithPageReset":
      return {
        ...state,
        result: action.payload,
        page: 1,
      };
    case "nullResult":
      return {
        ...state,
        result: null,
      };
    case "limit":
      return {
        ...state,
        limit: action.payload,
      };
    case "fakeLoading":
      return {
        ...state,
        fakeLoading: action.payload,
      };
    case "filters":
      return {
        ...state,
        filters: action.payload,
      };
    default:
      return initialState;
  }
}

export default function SearchPage() {
  //VARIABLE
  const size = useWindowSize();
  const router = useRouter();
  const { t } = useTranslation();
  const { t: tHome } = useTranslation("home");
  const lang = getCookie("NEXT_LOCALE");
  const [{ filters, searchInputMobileSize, fakeLoading, result, page, limit }, dispatch] =
    useReducer(reducer, initialState);

  //FUNCTION
  useEffect(() => {
    const params = getJsonFromUrl();
    if (params?.subjects) {
      params.subjects = params.subjects.split(",");
    }
    if (params?.status) {
      params.status = params.status.split(",");
    }
    if (params?.score) {
      params.score = {
        minScore: Number(params.score?.split("-")[0]),
        maxScore: Number(params.score?.split("-")[1]),
      };
    }
    if (params?.audience) {
      params.audience = {
        gender: params.audience?.split("-")[0],
        minAge: Number(params.audience?.split("-")[1]),
        maxAge: Number(params.audience?.split("-")[2]),
      };
    }
    if (params?.requirements) {
      params.requirements = params.requirements.split(",");
    }
    if (params?.minDate) {
      params.minDate =
        lang == "ar"
          ? convertArabicToGregorian(params?.minDate, "03:30")
          : new Date(params.minDate).toISOString();
    }
    if (params?.maxDate) {
      params.maxDate =
        lang == "ar"
          ? convertArabicToGregorian(params?.maxDate, "03:29", true)
          : new Date(params.maxDate).toISOString();
    }
    if (params?.search) {
      // eslint-disable-next-line no-self-assign
      params.search = params.search;
      dispatch({ type: "SearchInputMobileSize", payload: router.query?.search });
    }
    params?.source && delete params.source;
    params?.otherFilter && delete params.otherFilter;
    dispatch({ type: "filters", payload: params });
  }, [router.query]);

  const [getSearchedProject, { data: projectData, fetchMore: projectFetchMore }] = useLazyQuery(
    GET_CAMPAIGN_PROJECTS_LIST,
    {
      variables: {
        limit: limit,
        page: 0,
        campainLink:
          process.env.NEXT_PUBLIC_PUBLISH_DOMAIN +
          "/" +
          router.locale +
          router.asPath.split("?")[0],
        filters: {
          ...filters,
          search: size.width < 960 ? searchInputMobileSize : router.query?.search,
          coordinates:
            getFromStorage("coordinates") && router.query?.fromMap
              ? JSON.parse(getFromStorage("coordinates"))
              : null,
        },
      },
      fetchPolicy: "no-cache",
    }
  );

  const fetchingMore = () => {
    projectFetchMore({ variables: { page } })
      .then(({ data }) => {
        dispatch({
          type: "resultWithPageIncrease",
          payload: [
            ...result,
            ...(data?.get_campain_projects_list?.result
              ? data.get_campain_projects_list.result
              : null),
          ],
        });
      })
      .catch((e) => console.error("error", e));
  };

  const total = projectData?.get_campain_projects_list?.total ?? 0;

  useEffect(() => {
    if (limit) {
      dispatch({ type: "nullResult", payload: null });
      getSearchedProject()
        .then(({ data }) => {
          dispatch({
            type: "resultWithPageReset",
            payload: data?.get_campain_projects_list?.result,
          });
        })
        .catch((e) => console.error("error", e));
    }
  }, [limit, filters, searchInputMobileSize]);

  useEffect(() => {
    const _initialUrl = getFromStorage("initialUrl");
    if (!_initialUrl) {
      saveToStorage("initialUrl", router.asPath);
    }
    if (router.query.source !== "project") {
      router.query.source = "project";
      router.query.sort = "LATEST";
      router.replace(router);
    }
  }, []);

  useEffect(() => {
    //SET_LIMIT
    if (size.width < 720) {
      dispatch({ type: "limit", payload: 6 });
    } else if (size.width > 720 && size.width < 960) {
      dispatch({ type: "limit", payload: 12 });
    } else {
      dispatch({ type: "limit", payload: 24 });
    }
  }, [size.width]);
  //JSX
  return (
    <>
      <Head>
        <title>{t("search")}</title>
      </Head>
      <div className="bg-white w-full h-auto pt-5 pb-20 2xl:w-[1320px] 2xl:m-auto">
        <div className="lg:hidden w-full flex items-center mt-[10px] px-4 gap-x-2">
          <BackButton
            onClick={() => router.back()}
            dir={["Ar", "ar"].includes(lang) ? "right" : "left"}
          />
          <div className=" h-[38px] flex items-center rounded-[24px] bg-gray6 w-full">
            <input
              className={`w-full h-[33px] py-[11px] pr-3 ltr:pl-3 pl-[15px] ltr:pr-[35px] rounded-[24px] bg-gray6 outline-none focus:outline-none border-none focus:border-none`}
              placeholder={tHome("searchInProjects")}
              autoComplete="off"
              onChange={(e) => dispatch({ type: "SearchInputMobileSize", payload: e.target.value })}
              value={searchInputMobileSize}
            />
            <div className={`absolute ltr:right-[25px] rtl:left-[25px] px-1`}>
              <SearchNormal1 color="#7B808C" size="16" />
            </div>
          </div>
        </div>

        <SearchFilterBadges
          t={t}
          tHome={tHome}
          lang={lang}
          dispatch={dispatch}
          changeableSource={false}
        />

        <InfiniteScroll
          dataLength={result?.length ?? 0}
          hasMore={limit * page < total}
          next={fetchingMore}
          style={{ marginTop: "20px", overflow: "unset" }}
        >
          {!result || fakeLoading || !limit ? (
            <div className="md:grid md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 25 }, (_, i) => i + 1).map((item) => (
                <ProjectCardSkeleton
                  key={item}
                  searchPage
                  imgHeight="h-[180px] 400:h-[220px] 480:h-[240px]"
                  isRequest={router.query.source === "request"}
                />
              ))}
            </div>
          ) : result.length !== 0 && !fakeLoading && !!limit ? (
            <>
              <div className="md:grid md:grid-cols-2 xl:grid-cols-3">
                {result?.map((i, index) => {
                  return (
                    <div key={index} className="flex justify-center px-4">
                      <div
                        className={`flex justify-center mb-5 w-full ${
                          router.query?.source === "project"
                            ? "min-h-[280px] 400:min-h-[300px] 480:min-h-[330px]"
                            : "min-h-[240px] 400:min-h-[257px] 480:min-h-[292px]"
                        } `}
                      >
                        <ProjectCard
                          data={i}
                          cardId={i._id}
                          t={t}
                          isRequest={router.query?.source === "project" ? false : true}
                          isPrivate={false}
                          imgUrl={i?.imgs?.[0] || null}
                          loadingHeight="h-[260px]"
                          imgHeight="h-[180px] 400:h-[220px] 480:h-[240px]"
                          openInNewTab={true}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            result?.length === 0 && <NoResult showInPage={true} />
          )}
        </InfiniteScroll>
      </div>
    </>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["home", "common"])),
    },
  };
}
