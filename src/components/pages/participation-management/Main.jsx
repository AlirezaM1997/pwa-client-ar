import { Share } from "@lib/svg";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { useLazyQuery, useQuery } from "@apollo/client";
import InfiniteScroll from "react-infinite-scroll-component";
import { ArrowLeft, ArrowRight, Setting4 } from "iconsax-react";
import { convertArabicToGregorian } from "@functions/convertArabicToGregorian";
//GQL
import { ASSOCIATION_GET_PROJECT_PARTICIPATIONS } from "@services/gql/query/ASSOCIATION_GET_PROJECT_PARTICIPATIONS";
//FUNCTION
import { omit } from "@functions/omit";
import { saveToStorage } from "@functions/saveToStorage";
import { getJsonFromUrl } from "@functions/getJsonFromUrl";
import { getFromStorage } from "@functions/getFromStorage";
//COMPONENT
import Card from "./Card";
import Loading from "@components/kit/loading/Loading";
import SearchInput from "@components/kit/Input/SearchInput";
import CustomButton from "@components/kit/button/CustomButton";
import { GET_SINGLE_PROJECT_IN_PROJECT_MANAGEMENT } from "@services/gql/query/GET_SINGLE_PROJECT_IN_PROJECT_MANAGEMENT";
// COMPONENT DYNAMIC IMPORT
const ShareModal = dynamic(() => import("@components/common/ShareModal"), {
  ssr: false,
});
const NoResult = dynamic(() => import("@components/common/NoResult"), { ssr: false });
const FiltersModal = dynamic(() => import("@components/common/filter/Main"), { ssr: false });
const CustomModal = dynamic(() => import("@components/kit/modal/CustomModal"), { ssr: false });

export default function ParticipationManagement({ t, tPM, tHome, id }) {
  const size = useWindowSize();
  const limit_item = size.width < 960 ? 9 : 24;
  const lang = getCookie("NEXT_LOCALE");
  const router = useRouter();
  const isMobile = useWindowSize().width < 960;
  const [participations, setParticipations] = useState(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState(getFromStorage("participationSearch") || null);
  const [filterCount, setFilterCount] = useState(0);
  const [filters, setFilters] = useState({});
  const [openAllFilters, setOpenAllFilters] = useState(false);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [shareHintModal, setOpenshareHintModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const initialParams = router.query;
  delete initialParams?.id;

  const getSingleProject = useQuery(GET_SINGLE_PROJECT_IN_PROJECT_MANAGEMENT, {
    variables: {
      id,
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    const _filterCount = Object.keys(router.query).filter(
      (item) =>
        item !== "search" &&
        item !== "participationSearch" &&
        item !== "id" &&
        item !== "otherFilter"
    ).length;
    setFilterCount(
      router.query?.minDate?.length !== 0 && router.query?.maxDate?.length
        ? _filterCount - 1
        : _filterCount
    );

    const params = getJsonFromUrl();

    if (params?.theType) {
      params.theType = params.theType.split(",");
    }
    if (params?.status) {
      params.status = params.status.split(",");
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
    delete params?.otherFilter;
    setFilters(params);
  }, [router.query]);

  const [getParticipations, { error, loading, data, fetchMore }] = useLazyQuery(
    ASSOCIATION_GET_PROJECT_PARTICIPATIONS,
    {
      variables: {
        projectId: `${id}`,
        limit: limit_item,
        page: 0,
        participationFiltersData: {
          ...omit(filters, "requirements"),
          theType: filters?.requirements?.split(","),
          search,
        },
      },
      fetchPolicy: "no-cache",
    }
  );
  useEffect(() => {
    if (search === "") {
      localStorage.removeItem("participationSearch");
    } else {
      if (search) saveToStorage("participationSearch", search);
    }
    setParticipations(null);
    getParticipations()
      .then(({ data }) => {
        setParticipations(data?.association_get_project_participations?.result);
        setPage(1);
      })
      .catch((error) =>
        error?.message === "Authorization failed" || error?.message === "Token required"
          ? router.push("/login", undefined, { shallow: true })
          : router.push("/404", undefined, { shallow: true })
      );
  }, [search, filters]);

  const total = data?.association_get_project_participations?.total ?? 0;

  useEffect(() => {
    if (data?.association_get_project_participations?.total === 0 && filterCount === 0) {
      setOpenshareHintModal(true);
    }
  }, [data?.association_get_project_participations?.total]);

  const fetchingMore = () => {
    if (!data) return;
    fetchMore({ variables: { page } })
      .then(({ data }) => {
        setParticipations([
          ...participations,
          ...(data?.association_get_project_participations?.result
            ? data.association_get_project_participations.result
            : null),
        ]);
        setPage(page + 1);
      })
      .catch((e) => console.log("error", e));
  };

  if (error?.message === "Authorization failed" || error?.message === "Token required") {
    router.push("/login", undefined, { shallow: true });
  }
  if (error?.message === "not belong to u") {
    router.push("/404", undefined, { shallow: true });
  }

  return (
    <>
      <section className="w-full pb-[100px] px-4 2xl:max-w-[1320px] 2xl:m-auto">
        <header className="w-full bg-white lg:mt-[39px]">
          <div className="mt-[22px] mb-[20px]">
            <SearchInput
              icon={
                !isMobile ? null : lang === "en" ? (
                  <ArrowLeft color="#7B808C" size={16} />
                ) : (
                  <ArrowRight color="#7B808C" size={16} />
                )
              }
              buttonOnClick={() =>
                router.replace(`/activity/project-management/${id}`, undefined, { shallow: true })
              }
              value={search}
              setValue={setSearch}
              isIconLeft={true}
            />
          </div>
        </header>
        <CustomButton
          title={
            <div className="flex items-center">
              <p className={` ${filterCount > 0 ? "text-white" : "text-gray4"} `}>{t("filters")}</p>
              {filterCount > 0 && (
                <p className="h-[16px] w-[16px] bg-white rounded-xl text-[#03A6CF] mx-1">
                  {filterCount}
                </p>
              )}
            </div>
          }
          styleType={filterCount > 0 ? "Primary" : "Secondary"}
          borderColor={"border-gray4"}
          textColor={filterCount > 0 ? "text-white" : "text-gray4"}
          size={"S"}
          paddingX={"px-[10px]"}
          onClick={() => {
            router.query.id = id;
            router.query.otherFilter = "open";
            router.push(router);
            setOpenAllFilters(true);
          }}
          icon={<Setting4 size={16} color={filterCount > 0 ? "#FDFDFD" : "#ACACAF"} />}
          isIconLeftSide={lang == "ar" ? true : false}
        />
        {(!data && loading) || fakeLoading ? (
          <Loading loadingHeight="500px" />
        ) : !loading && total === 0 ? (
          <NoResult />
        ) : (
          <InfiniteScroll
            dataLength={participations?.length ?? 0}
            hasMore={limit_item * page < total}
            next={fetchingMore}
            style={{ overflow: "unset" }}
            className="flex flex-col gap-[20px] mt-[15px] lg:grid lg:grid-cols-2 lg:mt-[20px]"
          >
            {participations?.map((i, index) => (
              <div key={index} className="min-h-[180px]">
                <Card data={i} t={t} tPM={tPM} />
              </div>
            ))}
          </InfiniteScroll>
        )}

        {openAllFilters && (
          <FiltersModal
            t={t}
            tHome={tHome}
            open={openAllFilters}
            setOpen={setOpenAllFilters}
            initialParams={initialParams}
            setFakeLoading={setFakeLoading}
            isInMap={false}
            isInParticipation={true}
            firstUrl={location.pathname}
          />
        )}

        <CustomModal
          description={tPM("shareHintDesc")}
          openState={shareHintModal}
          oneButtonOnClick={() => setOpenShareModal(true)}
          hasOneButton={true}
          icon={
            <div className="flex items-center justify-center rounded-full bg-[#03A7CC14] w-[72px] h-[72px]">
              <Share w="29" h="30" color="#03A6CF" />
            </div>
          }
          oneButtonLabel={tPM("share")}
          hasCloseBtn={true}
          cancelOnClick={() => setOpenshareHintModal(false)}
        />
        <ShareModal
          t={t}
          data={getSingleProject.data?.getSingleProject}
          open={openShareModal}
          shareLink={`${process.env.NEXT_PUBLIC_PUBLISH_DOMAIN}/${lang}/project-profile/${id}`}
          close={() => {
            setOpenShareModal(false);
            setOpenshareHintModal(false);
            toast.remove();
          }}
        />
      </section>
    </>
  );
}
