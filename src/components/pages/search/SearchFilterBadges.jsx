import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { ArrowCircleDown, Refresh, Setting4 } from "iconsax-react";
//FUNCTION
import { getFromStorage } from "@functions/getFromStorage";
//COMPONENT
import CustomButton from "@components/kit/button/CustomButton";
import { getJsonFromUrl } from "@functions/getJsonFromUrl";
// COMPONENT DYNAMIC IMPORT
const Sort = dynamic(() => import("@components/common/filter/Sort"), { ssr: false });
const Source = dynamic(() => import("@components/common/filter/Source"), { ssr: false });
const Subject = dynamic(() => import("@components/common/filter/Subject"), { ssr: false });
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const FiltersModal = dynamic(() => import("@components/common/filter/Main"), { ssr: false });
const CustomTransitionModal = dynamic(() => import("@components/kit/modal/CustomTransitionModal"), {
  ssr: false,
});

const SearchFilterBadges = ({ t, tHome, lang, dispatch, changeableSource = true }) => {
  const [filterCount, setFilterCount] = useState(0);
  const [openSort, setOpenSort] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [openSubject, setOpenSubject] = useState(false);
  const [openOtherFilters, setOpenOtherFilters] = useState(false);
  const [activeResetBtn, setActiveResetBtn] = useState(false);
  const listName = {
    request: t("requests"),
    project: t("project"),
    collections: t("associations"),
  };

  const sortLabel = (sortValue) => {
    const lookup = {
      MOST_VISIT_COUNT: t("popularity"),
      MOST_PARTICIPATED: t("participationCount"),
      LATEST: t("last"),
      OLDEST: t("oldest"),
      HIGHEST_PROJECT_COUNTS: t("mostProjectsCounts"),
      HIGHEST_SCORE: t("mostScore"),
      MOST_FOLLOWER_COUNTS: t("mostFollowers"),
    };
    const result = lookup[sortValue];
    return result;
  };

  const router = useRouter();
  const size = useWindowSize();
  const path = changeableSource
    ? `/search?source=${router.query.source}&sort=${router.query.sort}`
    : `${router.asPath.split("?")[0]}?source=${router.query.source}&sort=LATEST`;
  useEffect(() => {
    const params = getJsonFromUrl();
    const _filterCount = params ? Object.keys(params).filter(
      (item) =>
        item !== "sort" &&
        item !== "source" &&
        item !== "search" &&
        item !== "subjects" &&
        item !== "fromMap" &&
        item !== "otherFilter"
    ).length: 0;
    setFilterCount(
      router.query?.minDate?.length !== 0 && router.query?.maxDate?.length
        ? _filterCount - 1
        : _filterCount
    );
    // for reset button
    if (router.query.fromMap) {
      const _query = Object.assign({}, router.query);
      delete _query.fromMap;
      _query.source === "project" && delete _query.source;
      _query.sort === "LATEST" && delete _query.sort;
      if (Object.is(JSON.parse(getFromStorage("initialParams")), _query)) {
        setActiveResetBtn(false);
      } else {
        setActiveResetBtn(true);
      }
    } else {
      if (path !== router.asPath) {
        setActiveResetBtn(true);
      } else {
        setActiveResetBtn(false);
      }
    }
  }, [router.query]);

  const resetFilter = () => {
    if (router.query.fromMap) {
      router.replace(
        {
          pathname: "search",
          query: {
            ...JSON.parse(getFromStorage("initialParams")),
            source: "project",
            sort: "LATEST",
            fromMap: true,
          },
        },
        undefined,
        { shallow: true }
      );
      setActiveResetBtn((activeBtn) => !activeBtn);
    } else {
      path && router?.replace(path, undefined, { shallow: true });
      setActiveResetBtn((activeBtn) => !activeBtn);
    }
  };

  return (
    <>
      <div className="flex flex-row gap-x-[10px] justify-start items-center mt-3 overflow-x-auto whitespace-nowrap no-scrollbar px-4">
        <CustomButton
          title={listName[router.query?.source]}
          styleType="Primary"
          size={"S"}
          textColor={"text-white"}
          paddingX={"px-[10px]"}
          onClick={() => (changeableSource ? setOpenList(true) : null)}
          icon={
            changeableSource ? <ArrowCircleDown color="#FDFDFD" size={16} variant="Bulk" /> : null
          }
          isIconLeftSide={lang == "ar" ? true : false}
        />
        {router.query?.source !== "collections" && (
          <CustomButton
            title={
              <div className="flex items-center">
                {router.query?.subjects && router.query?.subjects.length !== 0 && (
                  <p className="h-[16px] w-[16px] bg-white rounded-xl text-[#03A6CF] text-[9px] font-medium leading-[12.5px] mx-1 flex items-center justify-center">
                    {router.query?.subjects?.split(",")?.length}
                  </p>
                )}
                <p className={` ${!router.query.subjects ? "text-gray4" : "text-white"}`}>
                  {router.query.subjects ? t("subject") : t("subject")}
                </p>
              </div>
            }
            styleType={!router.query.subjects ? "Secondary" : "Primary"}
            borderColor={"border-gray4"}
            textColor={router.query.subjects ? "text-gray4" : "text-white"}
            size={"S"}
            paddingX={"px-[10px]"}
            onClick={() => setOpenSubject(true)}
            icon={
              <ArrowCircleDown
                size={16}
                color={router.query.subjects ? "#FDFDFD" : "#ACACAF"}
                variant="Bulk"
              />
            }
            isIconLeftSide={lang == "ar" ? true : false}
          />
        )}
        <CustomButton
          title={sortLabel(router.query.sort)}
          styleType={"Primary"}
          borderColor={"border-gray4"}
          textColor={"text-white"}
          size={"S"}
          paddingX={"px-[10px]"}
          onClick={() => setOpenSort(true)}
          icon={<ArrowCircleDown size={16} color={"#FDFDFD"} variant="Bulk" />}
          isIconLeftSide={lang == "ar" ? true : false}
        />
        {router.query?.source !== "collections" && (
          <div>
            <CustomButton
              title={
                <div className="flex items-center">
                  <p className={` ${filterCount > 0 ? "text-white" : "text-gray4"} `}>
                    {t("filters")}
                  </p>
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
                router.query.otherFilter = "open";
                router.push(router);
                setOpenOtherFilters(true);
              }}
              icon={<Setting4 size={16} color={filterCount > 0 ? "#FDFDFD" : "#ACACAF"} />}
              isIconLeftSide={lang == "ar" ? true : false}
            />
          </div>
        )}

        <div className={activeResetBtn ? "block" : "hidden"}>
          <CustomButton
            title={
              <div className="flex items-center">
                <p className="text-gray4">{t("reset")}</p>
              </div>
            }
            styleType="Secondary"
            borderColor="border-gray4"
            textColor="text-gray4"
            size="S"
            paddingX="px-[10px]"
            onClick={resetFilter}
            icon={<Refresh size="16" color="#ACACAF" />}
            isIconLeftSide={lang == "ar" ? true : false}
          />
        </div>
      </div>
      {size.width < 960 ? (
        <>
          <BottomSheet open={openSort} setOpen={setOpenSort}>
            <Sort t={t} lang={lang} setOpenSort={setOpenSort} />
          </BottomSheet>

          <BottomSheet open={openList} setOpen={setOpenList}>
            <Source t={t} lang={lang} setOpen={setOpenList} />
          </BottomSheet>

          <BottomSheet open={openSubject} setOpen={setOpenSubject}>
            <Subject t={t} tHome={tHome} setOpenSubject={setOpenSubject} />
          </BottomSheet>

          {openOtherFilters &&
            (router.query?.source === "project" || router.query?.source === "request") && (
              <FiltersModal
                t={t}
                tHome={tHome}
                open={openOtherFilters}
                setOpen={setOpenOtherFilters}
                initialParams={router.query}
                dispatch={dispatch}
                isRequest={router.query?.source === "request"}
              />
            )}
        </>
      ) : (
        <>
          <CustomTransitionModal open={openSort} close={() => setOpenSort(false)} width="500px">
            <Sort t={t} lang={lang} setOpenSort={setOpenSort} />
          </CustomTransitionModal>

          <CustomTransitionModal open={openList} close={() => setOpenList(false)} width="500px">
            <Source t={t} lang={lang} setOpen={setOpenList} />
          </CustomTransitionModal>

          <CustomTransitionModal
            open={openSubject}
            close={() => setOpenSubject(false)}
            width="max-content"
          >
            <Subject t={t} tHome={tHome} setOpenSubject={setOpenSubject} />
          </CustomTransitionModal>

          {openOtherFilters &&
            (router.query?.source === "project" || router.query?.source === "request") && (
              <FiltersModal
                t={t}
                tHome={tHome}
                open={openOtherFilters}
                setOpen={setOpenOtherFilters}
                initialParams={router.query}
                dispatch={dispatch}
                isRequest={router.query?.source === "request"}
              />
            )}
        </>
      )}
    </>
  );
};

export default SearchFilterBadges;
