import Link from "next/link";
import Head from "next/head";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { getCookie } from "cookies-next";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useWindowSize } from "@uidotdev/usehooks";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DocumentText, HambergerMenu, Profile2User, SearchNormal1, Task } from "iconsax-react";
//GQL
import { GET_HQ_LIST } from "@services/gql/query/GET_HQ_LIST";
import { GET_BANNERS } from "@services/gql/query/GET_BANNERS";
import { GET_PROJECTS } from "@services/gql/query/GET_PROJECTS";
import { GET_SETAD_LIST } from "@services/gql/query/GET_SETAD_LIST";
import { GET_ASSOCIATIONS } from "@services/gql/query/GET_ASSOCIATIONS";
import { GET_PROJECT_REQUESTS } from "@services/gql/query/GET_PROJECT_REQUESTS";
//FUNCTION
import Skeleton from "@components/kit/skeleton/Main";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
import DataCountSkeleton from "@components/pages/index/DataCountSkeleton";
import BannerCardSkeleton from "@components/pages/index/BannerCardSkeleton";
import ProjectCardSkeleton from "@components/kit/card/project-card-skeleton/Main";

//COMPONENT
const MapDetail = dynamic(() => import("@components/pages/index/MapDetail"), { ssr: false });
const HorizontalCarousel = dynamic(() => import("@components/common/HorizontalCarousel"), {
  ssr: false,
});
const BannerCard = dynamic(() => import("@components/pages/index/BannerCard"), {
  ssr: false,
});
const HeroSlider = dynamic(() => import("@components/pages/index/HeroSlider"), {
  ssr: false,
});
const ProjectCard = dynamic(() => import("@components/kit/card/project-card/Main"), {
  ssr: false,
});
const GlobalSearchModal = dynamic(() => import("@components/common/globalSearchModal/Main"), {
  ssr: false,
});
const ChangeLang = dynamic(() => import("@components/common/ChangeLang"), {
  ssr: false,
});
const Header = dynamic(() => import("@components/common/Header"), {
  ssr: false,
});

export default function HomePage() {
  //VARIABLE
  const { t } = useTranslation();
  const { t: tHome } = useTranslation("home");
  const lang = getCookie("NEXT_LOCALE");
  const size = useWindowSize();
  const screenSize = size.width > 960 ? "DESKTOP" : "MOBILE";
  const [showSearchView, setShowSearchView] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //API
  const mostPopularProjects = useQuery(GET_PROJECTS, {
    variables: {
      page: 0,
      limit: 6,
      filters: {
        sort: "MOST_VISIT_COUNT",
      },
    },
  });
  const latestProjects = useQuery(GET_PROJECTS, {
    variables: {
      page: 0,
      limit: 6,
      filters: {
        sort: "LATEST",
      },
    },
  });
  const allProjects = useQuery(GET_PROJECTS, {
    variables: {
      filters: {
        status: [
          "CHECKING",
          "SEARCHINGFORPARTICIPANTS",
          "ONGOING",
          "END",
          "ACTIVE",
          "PAUSEDBYUSER",
          "ARCHIVED",
        ],
      },
    },
    fetchPolicy: "no-cache",
  });
  const activeProjects = useQuery(GET_PROJECTS, {
    variables: {
      filters: {
        status: ["ACTIVE"],
      },
    },
    fetchPolicy: "no-cache",
  });
  const highestScoreAssociations = useQuery(GET_ASSOCIATIONS, {
    variables: {
      page: 0,
      limit: 12,
      filters: {
        sort: "HIGHEST_SCORE",
      },
    },
  });
  const latestProjectRequest = useQuery(GET_PROJECT_REQUESTS, {
    variables: {
      page: 0,
      limit: 6,
      filters: {
        sort: "LATEST",
      },
    },
  });
  const mostPopularProjectRequest = useQuery(
    GET_PROJECT_REQUESTS,
    {
      variables: {
        page: 0,
        limit: 6,
        filters: {
          sort: "MOST_VISIT_COUNT",
        },
      },
    },
    { fetchPolicy: "no-cache" }
  );
  const getBanners = useQuery(GET_BANNERS, {
    variables: {
      position: ["v2", "v3", "v4"],
      screenSize,
      page: null,
      limit: null,
    },
  });
  const getSetadList = useQuery(GET_SETAD_LIST, {
    variables: {
      page: 0,
      limit: 6,
    },
  });
  const getHqList = useQuery(GET_HQ_LIST, {
    variables: {
      page: 0,
      limit: 6,
    },
  });

  ///////////////////////JSX///////////////////////
  if (isLoading) return <LoadingScreen />;

  //JSX
  return (
    <>
      <Head>
        <title>{tHome("page-title")}</title>
      </Head>
      <div
        className={`flex lg:hidden flex-col w-full border-b-[1px] border-gray5 pt-[15px] pb-[15px] shadow-md fixed z-[500] bg-white px-4`}
      >
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <div
              className={`relative ${
                lang == "ar" ? "w-[96px]" : "w-[116px] lg:w-[205px]"
              }  h-[34px]  rtl:ml-3 ltr:mr-3 `}
            >
              <Image
                alt="logo"
                src={
                  lang == "ar"
                    ? "/assets/images/logo-mofid-fa.png"
                    : "/assets/images/logo-mofid.png"
                }
                layout="fill"
              />
            </div>

            <HambergerMenu
              size={24}
              color="#292D32"
              className="mx-1"
              onClick={() => setShowLangModal(true)}
            />
          </div>
          <div className="w-full flex items-center mt-[14px] relative">
            <input
              className={`w-full py-[7px] rtl:pr-3 ltr:pl-3 rtl:pl-[35px] ltr:pr-[35px] caption3 bg-gray5 outline-none rounded-[27px] border-none focus:border-none`}
              placeholder={tHome("searchInProjects")}
              autoComplete="off"
              readOnly
              onClick={() => setShowSearchView(true)}
            />
            <div className={`absolute  ${lang == "ar" ? "left-[25px]" : "right-[25px]"} px-1`}>
              <SearchNormal1 color="#7B808C" size="16" />
            </div>
          </div>
        </div>
      </div>

      <section
        className={`pt-[140px] lg:pt-4 pb-[120px] lg:pb-[70px] 2xl:flex 2xl:flex-col 2xl:items-center 2xl:max-w-[1320px] 2xl:mx-auto`}
      >
        <div className="px-4 lg:px-0 overflow-hidden w-full min-h-[170px] lg:min-h-[480px]">
          <HeroSlider screenSize={screenSize} />
        </div>

        <div
          className={`mt-[20px] lg:mt-[60px] w-full ${
            mostPopularProjects.data?.get_projects?.total !== 0
              ? "min-h-[353px] lg:min-h-[380px]"
              : ""
          } `}
        >
          <HorizontalCarousel
            setIsLoading={setIsLoading}
            lang={lang}
            t={t}
            title={tHome("mostPopularProjects")}
            hasShowMore={true}
            link={"search"}
            spaceBetween="16"
            swiperSlideWidth="100% !important"
            slidesOffsetBefore={"10"}
            query={{ source: "project", sort: "MOST_VISIT_COUNT" }}
            array={
              mostPopularProjects.loading || mostPopularProjects.error
                ? Array.from({ length: 5 }, (_, i) => i + 1).map((_, i) => (
                    <ProjectCardSkeleton key={i + "mostPopularProjects1"} />
                  ))
                : mostPopularProjects.data?.get_projects.result.map((i, _j) => (
                    <div
                      key={_j + "mostPopularProjects2"}
                      className="w-[314px]"
                      onClick={() => setIsLoading(true)}
                    >
                      <ProjectCard
                        data={i}
                        refetch={mostPopularProjects.refetch}
                        cardId={i._id}
                        t={t}
                        isRequest={false}
                        isPrivate={false}
                        imgUrl={i?.imgs && i?.imgs[0] ? i?.imgs[0] : null}
                        loadingHeight="h-[260px]"
                      />
                    </div>
                  ))
            }
          />
        </div>

        <div
          className={`mt-[30px] lg:mt-[60px] w-full ${
            latestProjectRequest.data?.get_project_requests?.total !== 0
              ? "min-h-[262px] lg:min-h-[289px"
              : ""
          } ]`}
        >
          <HorizontalCarousel
            setIsLoading={setIsLoading}
            lang={lang}
            t={t}
            title={tHome("latestRequests")}
            hasShowMore={true}
            spaceBetween="16"
            swiperSlideWidth="100% !important"
            slidesOffsetBefore={"10"}
            link={"search"}
            query={{ source: "request", sort: "LATEST" }}
            array={
              latestProjectRequest.loading || latestProjectRequest.error
                ? Array.from({ length: 5 }, (_, i) => i + 1).map((_, i) => (
                    <ProjectCardSkeleton key={i + "latestRequests1"} isRequest={false} />
                  ))
                : latestProjectRequest.data?.get_project_requests.result.map((i, _j) => (
                    <div
                      key={_j + "latestRequests2"}
                      className="w-[314px]"
                      onClick={() => setIsLoading(true)}
                    >
                      <ProjectCard
                        t={t}
                        data={i}
                        cardId={i._id}
                        refetch={latestProjectRequest.refetch}
                        isRequest={true}
                        isPrivate={false}
                        imgUrl={i?.imgs && i?.imgs[0] ? i?.imgs[0] : null}
                        loadingHeight="h-[260px]"
                      />
                    </div>
                  ))
            }
          />
        </div>

        <div className={`mt-[30px] lg:mt-[60px] w-full  lg:min-h-[216px]`}>
          {size.width < 1440 ? (
            <HorizontalCarousel
              lang={lang}
              setIsLoading={setIsLoading}
              t={t}
              title={tHome("makeDesiredParticipation")}
              hasShowMore={false}
              spaceBetween="16"
              slidesOffsetBefore={"10"}
              array={
                getBanners?.loading || getBanners?.error
                  ? Array.from({ length: 5 }, (_, i) => i + 1).map((_, i) => (
                      <BannerCardSkeleton key={i + "makeDesiredParticipation1"} />
                    ))
                  : getBanners?.data?.get_banners
                      .filter((i) => i.position === "v2" && i.screenSize === screenSize)
                      .map((i, _j) => (
                        <div
                          key={_j + "makeDesiredParticipation2"}
                          onClick={() => setIsLoading(true)}
                        >
                          <BannerCard imageUrl={i.image} link={i.url} />
                        </div>
                      ))
              }
            />
          ) : (
            <div>
              <div className=" mb-4 lg:mb-[34px] px-[30px]">
                <h1 className="titleInput lg:ctaDesktop2 lg:leading-[26px] text-black 1440:text-center">
                  {tHome("makeDesiredParticipation")}
                </h1>
              </div>
              <div className="flex flex-wrap justify-center gap-8 px-[30px]">
                {getBanners?.loading || getBanners?.error
                  ? Array.from({ length: 6 }, (_, i) => i + 1).map((_, i) => (
                      <BannerCardSkeleton key={i + "makeDesiredParticipation1"} />
                    ))
                  : getBanners?.data?.get_banners
                      .filter((i) => i.position === "v2" && i.screenSize === screenSize)
                      .map((i, _j) => (
                        <div key={_j + "makeDesiredParticipation2"}>
                          <BannerCard imageUrl={i.image} link={i.url} />
                        </div>
                      ))}
              </div>
            </div>
          )}
        </div>

        {!getBanners?.loading &&
          !getBanners?.error &&
          getBanners.data?.get_banners.filter(
            (i) => i.position === "v3" && i.screenSize === screenSize
          )[0]?.image && (
            <div className={`flex lg:hidden justify-center mt-[60px] px-4 w-full`}>
              <Link
                href={
                  getBanners.data.get_banners.filter(
                    (i) => i.position === "v3" && i.screenSize === screenSize
                  )[0]?.url ?? ""
                }
                prefetch={false}
              >
                <div className="relative w-[324px] h-[111px] 400:w-[380px] 400:h-[140px] 480:w-[450px] 480:h-[160px] ">
                  <Image
                    src={
                      getBanners.data.get_banners.filter(
                        (i) => i.position === "v3" && i.screenSize === screenSize
                      )[0]?.image
                    }
                    layout="fill"
                    alt="support mofid"
                    className="rounded-lg"
                  ></Image>
                </div>
              </Link>
            </div>
          )}

        {!getBanners?.loading &&
          !getBanners?.error &&
          getBanners?.data?.get_banners.filter(
            (i) => i.position === "v3" && i.screenSize === screenSize
          )[0]?.image &&
          getBanners?.data?.get_banners.filter(
            (i) => i.position === "v4" && i.screenSize === screenSize
          )[0]?.image && (
            <div className={`w-full flex justify-center mt-[30px] lg:mt-[60px] lg:gap-x-4`}>
              <Link href={"/create"} prefetch={false}>
                <div className="relative w-[324px] h-[111px] 400:w-[380px] 400:h-[140px] 480:w-[450px] 480:h-[160px] xl:w-[525px] xl:h-[187px] 2xl:w-[652px] 2xl:h-[232px]">
                  {getBanners?.data?.get_banners ? (
                    <Image
                      src={
                        getBanners?.data?.get_banners.filter(
                          (i) => i.position === "v4" && i.screenSize === screenSize
                        )[0]?.image
                      }
                      layout="fill"
                      alt="addProjectOrRequest"
                      className="rounded-lg"
                      onClick={() => setIsLoading(true)}
                    ></Image>
                  ) : (
                    <Skeleton height="100%" />
                  )}
                </div>
              </Link>
              <Link
                href={
                  getBanners?.data?.get_banners.filter(
                    (i) => i.position === "v3" && i.screenSize === screenSize
                  )[0]?.url ?? ""
                }
                className="hidden lg:block"
                prefetch={false}
              >
                <div className="relative w-[324px] h-[111px] 400:w-[380px] 400:h-[140px] 480:w-[450px] 480:h-[160px] xl:w-[525px] xl:h-[187px] 2xl:w-[652px] 2xl:h-[232px] ">
                  {getBanners?.data?.get_banners ? (
                    <Image
                      src={
                        getBanners?.data?.get_banners.filter(
                          (i) => i.position === "v3" && i.screenSize === screenSize
                        )[0]?.image
                      }
                      layout="fill"
                      alt="addProjectOrRequest"
                      className="rounded-lg"
                      onClick={() => setIsLoading(true)}
                    ></Image>
                  ) : (
                    <Skeleton height="100%" />
                  )}
                </div>
              </Link>
            </div>
          )}

        {/* DATA COUNT AND MAP VIEW */}
        <div className={`px-4 mt-[50px] lg:mt-[100px] lg:min-h-[588px]`}>
          <div className="flex flex-col lg:items-center justify-center border-[1px] border-gray5 lg:border-none rounded-2xl p-3 pb-4 lg:p-0">
            {latestProjectRequest.loading ? (
              <div className="relative">
                <Skeleton
                  height={size.width < 960 ? "373px" : "475px"}
                  width={size.width < 960 ? "659px" : "840px"}
                  className={"rounded-2xl w-full max-w-[840px]"}
                  borderRadius={12}
                />
              </div>
            ) : (
              <Link href={"/map"} onClick={() => setIsLoading(true)} prefetch={false}>
                <div className="max-w-[840px] mx-auto">
                  <Image
                    className="w-full  h-auto rounded-lg"
                    src="/assets/images/home-map.png"
                    width={2500}
                    height={1400}
                  />
                </div>
              </Link>
            )}
            <div className="pt-3 lg:pt-[40px] lg:flex lg:gap-x-[90px] ">
              <>
                {latestProjectRequest.loading ? (
                  <DataCountSkeleton />
                ) : (
                  <MapDetail
                    iconElement={<DocumentText color="#03A6CF" size={size.width > 960 ? 24 : 20} />}
                    moneyFormatterValue={activeProjects.data?.get_projects?.total}
                    text={t("ActiveProjectsCount")}
                  />
                )}
              </>
              {mostPopularProjects.loading ? (
                <DataCountSkeleton />
              ) : (
                <MapDetail
                  iconElement={<Task color="#03A6CF" size={size.width > 960 ? 24 : 20} />}
                  moneyFormatterValue={allProjects.data?.get_projects?.total}
                  text={t("allProjectsCount")}
                />
              )}
              {highestScoreAssociations.loading ? (
                <DataCountSkeleton />
              ) : (
                <MapDetail
                  iconElement={<Profile2User color="#03A6CF" size={size.width > 960 ? 24 : 20} />}
                  moneyFormatterValue={highestScoreAssociations.data?.get_associations?.total}
                  text={t("associationsCount")}
                />
              )}
            </div>
          </div>
        </div>

        <div
          className={` w-full ${
            latestProjects.data?.get_projects?.total !== 0
              ? "mt-[30px] lg:mt-[90px] min-h-[353px] lg:min-h-[380px]"
              : ""
          } `}
        >
          <HorizontalCarousel
            lang={lang}
            t={t}
            setIsLoading={setIsLoading}
            title={tHome("latestProjects")}
            hasShowMore={true}
            link={"search"}
            spaceBetween="16"
            swiperSlideWidth="100% !important"
            slidesOffsetBefore={"10"}
            query={{ source: "project", sort: "LATEST" }}
            array={
              latestProjects.loading || latestProjects.error
                ? Array.from({ length: 5 }, (_, i) => i + 1).map((_, i) => (
                    <ProjectCardSkeleton key={i + "latestProjects1"} />
                  ))
                : latestProjects.data?.get_projects.result.map((i, _j) => (
                    <div
                      key={_j + "latestProjects2"}
                      className="w-[314px]"
                      onClick={() => setIsLoading(true)}
                    >
                      <ProjectCard
                        data={i}
                        refetch={latestProjects.refetch}
                        cardId={i._id}
                        t={t}
                        isPrivate={false}
                        isRequest={false}
                        imgUrl={i?.imgs && i?.imgs[0] ? i?.imgs[0] : null}
                        loadingHeight="h-[260px]"
                      />
                    </div>
                  ))
            }
          />
        </div>

        {!getHqList?.error && getHqList.data && (
          <div
            className={` w-full ${
              getHqList.data?.get_hq_list.total !== 0
                ? "mt-[30px] lg:mt-[90px] min-h-[140px] lg:min-h-[205px]"
                : ""
            } `}
          >
            <HorizontalCarousel
              lang={lang}
              t={t}
              title={tHome("headquarters")}
              hasShowMore={true}
              link={"setad-hq-list"}
              spaceBetween="16"
              swiperSlideWidth="100% !important"
              slidesOffsetBefore={"10"}
              setIsLoading={setIsLoading}
              query={{ source: "hq" }}
              array={getHqList.data?.get_hq_list.result.slice(0, 11)?.map((i, j) => (
                <Link
                  key={j + "Headquarters"}
                  href={`/hq-profile/${i._id}`}
                  className="flex flex-col items-center"
                  prefetch={false}
                >
                  <div className="relative w-[62px] h-[62px] lg:w-[100px] lg:h-[100px] rounded-full overflow-hidden shadow-md">
                    <Image
                      src={i.image ? i.image : "/assets/images/default-association-image.png"}
                      layout="fill"
                      alt={"image"}
                      className="cover-center-img"
                    />
                  </div>
                  <h4 className="caption3 text-center break-words max-w-[90px] mt-[5px]">
                    {i.name}
                  </h4>
                </Link>
              ))}
            />
          </div>
        )}

        {!getSetadList?.error && getSetadList.data && (
          <div
            className={` w-full ${
              getSetadList.data?.get_setad_list?.total !== 0
                ? "mt-[30px] lg:mt-[90px] min-h-[140px] lg:min-h-[205px]"
                : ""
            } `}
          >
            <HorizontalCarousel
              lang={lang}
              t={t}
              title={tHome("setads")}
              hasShowMore={true}
              link={"setad-hq-list"}
              spaceBetween="16"
              swiperSlideWidth="100%!important"
              slidesOffsetBefore={"10"}
              setIsLoading={setIsLoading}
              query={{ source: "setad" }}
              array={getSetadList.data?.get_setad_list.result.slice(0, 11).map((i, j) => (
                <Link
                  key={j + "Setad"}
                  href={`/setad-profile/${i._id}`}
                  className="flex flex-col items-center"
                  prefetch={false}
                >
                  <div className="relative w-[62px] h-[62px] lg:w-[100px] lg:h-[100px] rounded-full overflow-hidden shadow-md">
                    <Image
                      src={i.image ? i.image : "/assets/images/default-association-image.png"}
                      layout="fill"
                      alt={"image"}
                      className="cover-center-img"
                    />
                  </div>
                  <h4 className="caption3 leading-[16px] text-center break-words max-w-[90px] mt-[5px]">
                    {i.name}
                  </h4>
                </Link>
              ))}
            />
          </div>
        )}

        <div
          className={`mt-[30px] lg:mt-[60px] w-full ${
            mostPopularProjectRequest.data?.get_project_requests?.total !== 0
              ? "min-h-[262px] lg:min-h-[289px]"
              : ""
          } `}
        >
          <HorizontalCarousel
            lang={lang}
            setIsLoading={setIsLoading}
            t={t}
            title={tHome("mostPopularRequests")}
            hasShowMore={true}
            spaceBetween="16"
            swiperSlideWidth="100% !important"
            slidesOffsetBefore={"10"}
            link={"search"}
            query={{ source: "request", sort: "MOST_VISIT_COUNT" }}
            array={
              mostPopularProjectRequest.loading || mostPopularProjectRequest.error
                ? Array.from({ length: 5 }, (_, i) => i + 1).map((_, i) => (
                    <ProjectCardSkeleton key={i + "mostPopularRequests1"} isRequest={false} />
                  ))
                : mostPopularProjectRequest.data?.get_project_requests.result.map((i, _j) => (
                    <div
                      key={_j + "mostPopularRequests2"}
                      className="w-[314px]"
                      onClick={() => setIsLoading(true)}
                    >
                      <ProjectCard
                        t={t}
                        data={i}
                        cardId={i._id}
                        refetch={mostPopularProjectRequest.refetch}
                        isRequest={true}
                        isPrivate={false}
                        imgUrl={i?.imgs && i?.imgs[0] ? i?.imgs[0] : null}
                        loadingHeight="h-[260px]"
                      />
                    </div>
                  ))
            }
          />
        </div>
      </section>

      {showLangModal && (
        <div className="h-screen fixed flex flex-col bottom-0 z-[9999999] w-full top-0 left-0 bg-white">
          <Header onClick={() => setShowLangModal(false)} title={t("setting")} />
          <ChangeLang />
        </div>
      )}

      {showSearchView && (
        <GlobalSearchModal
          lang={lang}
          tHome={tHome}
          setShowSearchView={setShowSearchView}
          showSearchView={showSearchView}
        />
      )}
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["home", "common"])),
    },
  };
}
