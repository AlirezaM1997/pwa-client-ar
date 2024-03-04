import Head from "next/head";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Book, Filter } from "iconsax-react";
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { convertArabicToGregorian } from "@functions/convertArabicToGregorian";
//FUNCTION
import { saveToStorage } from "@functions/saveToStorage";
import { getFromStorage } from "@functions/getFromStorage";
import { getJsonFromUrl } from "@functions/getJsonFromUrl";
//GQL
import { GET_PROJECTS_MAP } from "@services/gql/query/GET_PROJECTS_MAP";
import { GET_ASSOCIATIONS_MAP } from "@services/gql/query/GET_ASSOCIATIONS_MAP";
//COMPONENT
import SearchInput from "@components/kit/Input/SearchInput";
import DesktopHeader from "@components/common/DesktopHeader";
import LoadingScreen from "@components/kit/loading/LoadingScreen";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const HomeMap = dynamic(() => import("@components/pages/map/Main"), { ssr: false });
const MapFilterBadges = dynamic(() => import("@components/pages/map/MapFilterBadges"), {
  ssr: false,
});
const FiltersModal = dynamic(() => import("@components/common/filter/Main"), { ssr: false });

export default function MapPage() {
  //VARIABLE
  const lang = getCookie("NEXT_LOCALE");
  const { t } = useTranslation();
  const { t: tHome } = useTranslation("home");
  const router = useRouter();
  const [openOffcanvas, setOpenOffcanvas] = useState(false);
  const [open, setOpen] = useState(false);
  const [center, setCenter] = useState([
    Number(getFromStorage("mapCenterLat")),
    Number(getFromStorage("mapCenterLng")),
  ]);
  const [fakeLoading, setFakeLoading] = useState(false);
  const [filters, setFilters] = useState(null);
  const [search, setSearch] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const [projectsResult, setProjectsResult] = useState([]);
  const [associationsResult, setAssociationsResult] = useState([]);

  //API
  const [
    getProjects,
    { data: projectsData, loading: projectsLoading, error: projectsError, refetch },
  ] = useLazyQuery(GET_PROJECTS_MAP, { fetchPolicy: "no-cache" });

  const [
    getAssociations,
    { data: associationsData, loading: associationsLoading, error: associationsError },
  ] = useLazyQuery(GET_ASSOCIATIONS_MAP, {
    fetchPolicy: "no-cache",
  });

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
    delete params?.group;
    setFilters(params);
  }, [router.query]);

  useEffect(() => {
    const params = getJsonFromUrl();
    const groupArray = params?.group?.split(",");
    if (groupArray && groupArray?.length === 1) {
      setAssociationsResult([]);
      setProjectsResult([]);
      if (groupArray?.includes("PROJECT")) {
        getProjects({
          variables: {
            page: 0,
            limit: 200,
            filters: { ...filters, search, coordinates },
          },
        }).then(({ data }) => {
          setProjectsResult(data?.get_projects.result);
        });
      } else {
        getAssociations({
          variables: {
            page: 0,
            limit: 200,
            filters: { search, coordinates },
          },
        }).then(({ data }) => {
          setAssociationsResult(data?.get_associations.result);
        });
      }
    } else {
      getProjects({
        variables: {
          page: 0,
          limit: 200,
          filters: { ...filters, search, coordinates },
        },
      }).then(({ data }) => {
        setProjectsResult(data?.get_projects.result);
      });
      getAssociations({
        variables: {
          page: 0,
          limit: 200,
          filters: { search, coordinates },
        },
      }).then(({ data }) => {
        setAssociationsResult(data?.get_associations.result);
      });
    }
  }, [coordinates, filters, search]);

  useEffect(() => {
    if (!!getFromStorage("mapCenterLat")) {
      setCenter([Number(getFromStorage("mapCenterLat")), Number(getFromStorage("mapCenterLng"))]);
    } else {
      setCenter([33.97594293751557, 53.31774214354411]);
    }
  }, []);

  useEffect(() => {
    saveToStorage("mapCenterLat", center[0] ? center[0] : 33.97594293751557);
    saveToStorage("mapCenterLng", center[1] ? center[1] : 53.31774214354411);
  }, [center]);

  useEffect(() => {
    if (
      ((!!projectsError && !projectsLoading) ||
        (projectsData?.get_projects?.result?.length === 0 && !projectsLoading)) &&
      ((!!associationsError && !associationsLoading) ||
        (associationsData?.get_projects?.result?.length === 0 && !associationsLoading))
    ) {
      toast.remove();
      toast.custom(() => <Toast text={t("noProjectAssociationError")} status="ERROR" />, {
        duration: 300,
      });
    }
  }, [
    projectsData,
    projectsError,
    projectsLoading,
    associationsData,
    associationsLoading,
    associationsError,
  ]);

  useEffect(() => {
    if (coordinates) {
      saveToStorage("coordinates", JSON.stringify(coordinates));
    }
  }, [coordinates]);

  const goToSearchPage = () => {
    saveToStorage("initialUrl", location.search);
    saveToStorage("initialParams", JSON.stringify(router.query));
    router.push(
      {
        pathname: "search",
        query: { ...router.query, source: "project", sort: "LATEST", search, fromMap: true },
      },
      undefined,
      { shallow: true }
    );
  };

  //JSX
  if (fakeLoading) return <LoadingScreen />;
  return (
    <>
      <NextSeo title={"mofidapp"} description={"mofidapp"} />
      <Head>
        <title>{t("map")}</title>
      </Head>
      <section className={`relative h-screen lg:fixed w-full`}>
        <div className="hidden lg:block">
          <DesktopHeader
            position="absolute"
            valueInput={search}
            setValueInput={setSearch}
            setShowSearchView={() => null}
            setIsLoading={setFakeLoading}
          />
        </div>
        <div className="top-0 absolute block lg:hidden w-full z-[1001] bg-white px-4 py-[10px]">
          <SearchInput
            icon={
              <Image src={"/assets/svg/guide.svg"} width={18} height={18} alt={"guide"}></Image>
            }
            buttonOnClick={() => router.push("/guide/map", undefined, { shallow: true })}
            value={search}
            setValue={setSearch}
          />
        </div>
        <div className={`chipsFilter absolute flex w-full z-[1001] pr-4 top-[60px] lg:top-[130px]`}>
          <button
            className={`cta1 py-[7px] px-[13px] flex items-center gap-x-2 cta1 rounded-lg bg-white border-[1px] border-gray5 ltr:mr-[5px] rtl:ml-[5px] ${
              openOffcanvas ? "ltr:ml-[366px] rtl:mr-[366px]" : ""
            } duration-700`}
            onClick={() => {
              router.query.otherFilter = "open";
              router.push(router);
              toast.remove();
              setOpen(true);
            }}
          >
            <span className={``}>{t("filters")}</span>
            <Filter size={16} />
          </button>
          <MapFilterBadges t={t} />
        </div>
        <div className="w-full h-full">
          <HomeMap
            setCenter={setCenter}
            center={center}
            t={t}
            result={[...(projectsResult ?? []), ...(associationsResult ?? [])]}
            resultError={projectsError || associationsError}
            loading={projectsLoading || associationsLoading}
            setOpenOffcanvas={setOpenOffcanvas}
            openOffcanvas={openOffcanvas}
            setCoordinates={setCoordinates}
          />
        </div>
        <button
          onClick={() => goToSearchPage()}
          className="z-[1003] w-[44px] h-[44px] fixed bottom-[100px] right-4 bg-white rounded-full flex items-center justify-center"
        >
          <Book size={22} />
        </button>
        {open && (
          <FiltersModal
            t={t}
            tHome={tHome}
            open={open}
            setOpen={setOpen}
            initialParams={router.query}
            setFakeLoading={setFakeLoading}
            isInMap={true}
            firstUrl={"/map"}
          />
        )}
      </section>
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
