import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useLazyQuery } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import { ArrowLeft, ArrowRight } from "iconsax-react";
//GQL
import { GET_SEARCH_DATA } from "@services/gql/query/GET_SEARCH_DATA";
//COMPONENT
import NoResult from "@components/common/NoResult";
import CustomModalScreen from "./CustomModalScreen";
import Loading from "@components/kit/loading/Loading";
import ModalScreen from "@components/common/ModalScreen";
import SearchInput from "@components/kit/Input/SearchInput";
import SearchHistory from "@components/pages/search/searchHistory";
//COMPONENT DYNAMIC IMPORT
const SearchCard = dynamic(() => import("@components/pages/index/SearchCard"), {
  ssr: false,
});
const HorizontalCarousel = dynamic(() => import("@components/common/HorizontalCarousel"), {
  ssr: false,
});

const limit_item = 10;

const MobileSearchBox = ({ lang, tHome, classNames, setShowSearchView }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [text, setText] = useState("");
  const [associationResult, setAssociationResult] = useState([]);
  const [projectResult, setProjectResult] = useState([]);
  const [requestResult, setRequestResult] = useState([]);

  const [getSearchData, { error, loading, data }] = useLazyQuery(GET_SEARCH_DATA, {
    variables: { search: text, limit: limit_item, page: 0 },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (!data && text.length > 2) getSearchData();
    if (data) {
      setAssociationResult(data?.get_search_data?.associations?.result);
      setProjectResult(data?.get_search_data?.projects?.result);
      setRequestResult(data?.get_search_data?.projectRequests?.result);
    }
  }, [data, text]);

  return (
    <div className={classNames}>
      <div className="px-4">
        <SearchInput
          icon={
            lang === "en" ? (
              <ArrowLeft color="#7B808C" size={16} />
            ) : (
              <ArrowRight color="#7B808C" size={16} />
            )
          }
          buttonOnClick={() => {
            setShowSearchView(false);
            document.body.style.overflow = "unset";
          }}
          value={text}
          setValue={setText}
          isIconLeft={true}
          query={{ search: text, source: "project", sort: "LATEST" }}
        />
      </div>

      <SearchHistory t={t} setSearch={setText} classNames="my-[30px]" />

      {error && (
        <div className="flex text-center justify-center mt-[100px]">
          <h5>{error.message}</h5>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center mt-[100px]">
          <Loading />
        </div>
      )}

      {data &&
        projectResult.length === 0 &&
        associationResult.length === 0 &&
        requestResult.length === 0 && <NoResult classNames="mt-[20px]" />}

      {data && projectResult.length !== 0 && text?.length !== 0 && (
        <div className="mt-[20px]">
          <HorizontalCarousel
            link={`/search`}
            query={{ source: "project", search: text, ...router.query, sort: "LATEST" }}
            lang={lang}
            t={t}
            title={tHome("projects")}
            hasShowMoreWhiteIcon={true}
            spaceBetween={"12"}
            array={projectResult?.map((i, _j) => {
              return (
                <div key={_j * 3}>
                  <SearchCard
                    data={i}
                    link={`/project-profile/${i._id}`}
                    title={i.title}
                    imgUrl={i?.imgs && i?.imgs[0] ? i?.imgs[0] : null}
                  />
                </div>
              );
            })}
          />
        </div>
      )}
      {data && associationResult.length !== 0 && text?.length !== 0 && (
        <div className="mt-[20px]">
          <HorizontalCarousel
            link={`/search`}
            query={{ source: "collections", search: text, sort: "HIGHEST_SCORE" }}
            lang={lang}
            t={t}
            title={tHome("associations")}
            hasShowMoreWhiteIcon={true}
            array={associationResult?.map((i, _j) => (
              <div key={_j * 3}>
                <SearchCard
                  data={i}
                  link={`/association-profile/${i._id}`}
                  title={i?.name}
                  imgUrl={i?.image ? i?.image : null}
                />
              </div>
            ))}
          />
        </div>
      )}
      {data && requestResult.length !== 0 && text?.length !== 0 && (
        <div className="mt-[20px]">
          <HorizontalCarousel
            link={`/search`}
            query={{ source: "request", search: text, sort: "LATEST" }}
            lang={lang}
            t={t}
            title={tHome("requests")}
            hasShowMoreWhiteIcon={true}
            array={requestResult?.map((i, _j) => (
              <div key={_j * 3}>
                <SearchCard
                  data={i}
                  link={`/project-request-profile/${i._id}`}
                  title={i.title}
                  imgUrl={i?.imgs && i?.imgs[0] ? i?.imgs[0] : null}
                />
              </div>
            ))}
          />
        </div>
      )}
    </div>
  );
};

const DesktopSearchBox = ({ text = "", setText, lang, classNames, setShowSearchView }) => {
  const { t } = useTranslation();
  const [associationResult, setAssociationResult] = useState([]);
  const [projectResult, setProjectResult] = useState([]);
  const [requestResult, setRequestResult] = useState([]);

  const [getSearchData, { error, loading, data }] = useLazyQuery(GET_SEARCH_DATA, {
    variables: { search: text, limit: limit_item, page: 0 },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (!data && text.length > 2) getSearchData();
    if (data) {
      setAssociationResult(data?.get_search_data?.associations?.result);
      setProjectResult(data?.get_search_data?.projects?.result);
      setRequestResult(data?.get_search_data?.projectRequests?.result);
    }
  }, [data, text]);

  return (
    <div className={classNames}>
      <SearchHistory t={t} setSearch={setText} classNames="mt-[24px] mb-[30px]" />

      {error && (
        <div className="flex text-center justify-center mt-[100px]">
          <h5>{error.message}</h5>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-[186px] mt-[20px]">
          <Loading />
        </div>
      )}

      {data &&
        projectResult.length === 0 &&
        associationResult.length === 0 &&
        requestResult.length === 0 && <NoResult classNames="mt-[20px]" />}

      {data && projectResult.length !== 0 && text?.length !== 0 && (
        <div className="mb-[40px]">
          <HorizontalCarousel
            link={`/search`}
            query={{ source: "project", search: text, sort: "LATEST" }}
            lang={lang}
            t={t}
            title={t("projects")}
            hasShowMoreWhiteIcon={true}
            onClickOnShowMore={() => setShowSearchView(false)}
            spaceBetween={"12"}
            slidesOffsetBefore="0"
            lgTitleMb="mb-[7px]"
            array={projectResult?.map((i, _j) => {
              return (
                <div key={_j * 3 + "projects"} onClick={() => setShowSearchView(false)}>
                  <SearchCard
                    data={i}
                    link={`/project-profile/${i._id}`}
                    title={i.title}
                    imgUrl={i?.imgs && i?.imgs[0] ? i?.imgs[0] : null}
                  />
                </div>
              );
            })}
          />
        </div>
      )}
      {data && associationResult.length !== 0 && text?.length !== 0 && (
        <div className="mb-[40px]">
          <HorizontalCarousel
            link={`/search`}
            query={{ source: "collections", sort: "HIGHEST_SCORE", search: text }}
            lang={lang}
            t={t}
            title={t("associations")}
            hasShowMoreWhiteIcon={true}
            onClickOnShowMore={() => setShowSearchView(false)}
            slidesOffsetBefore="0"
            lgTitleMb="mb-[7px]"
            array={associationResult?.map((i, _j) => (
              <div key={_j * 3 + "associations"} onClick={() => setShowSearchView(false)}>
                <SearchCard
                  data={i}
                  link={`/association-profile/${i._id}`}
                  title={i?.name}
                  imgUrl={i?.image ? i?.image : null}
                />
              </div>
            ))}
          />
        </div>
      )}
      {data && requestResult.length !== 0 && text?.length !== 0 && (
        <HorizontalCarousel
          link={`/search`}
          query={{ source: "request", sort: "LATEST", search: text }}
          lang={lang}
          t={t}
          title={t("requests")}
          hasShowMoreWhiteIcon={true}
          onClickOnShowMore={() => setShowSearchView(false)}
          slidesOffsetBefore="0"
          lgTitleMb="mb-[7px]"
          array={requestResult?.map((i, _j) => (
            <div key={_j * 3 + "requests"} onClick={() => setShowSearchView(false)}>
              <SearchCard
                data={i}
                link={`/project-request-profile/${i._id}`}
                title={i.title}
                imgUrl={i?.imgs && i?.imgs[0] ? i?.imgs[0] : null}
              />
            </div>
          ))}
        />
      )}
    </div>
  );
};

export default function GlobalSearchModal({
  text,
  setText = () => null,
  lang,
  tHome,
  setShowSearchView,
  showSearchView,
}) {
  const size = useWindowSize();

  return (
    <>
      {size.width < 960 ? (
        <ModalScreen open={showSearchView}>
          <MobileSearchBox
            lang={lang}
            tHome={tHome}
            classNames="w-full h-auto pt-5"
            setShowSearchView={setShowSearchView}
          />
        </ModalScreen>
      ) : (
        <CustomModalScreen
          open={showSearchView}
          cancelOnClick={() => {
            setShowSearchView(false);
            document.body.style.overflow = "unset";
          }}
          positionClass={`${lang == "ar" ? "right-[208px]" : "left-[208px]"} top-[-25px]`}
          sectionFromTop="top-[121px]"
        >
          <DesktopSearchBox
            lang={lang}
            tHome={tHome}
            classNames="pt-[32px] ltr:pl-[23px] rtl:pr-[23px] pb-[21px] h-max lg:w-[350px] xl:w-[400px] 2xl:w-[498px] 1800:!w-[544px]"
            text={text}
            setText={setText}
            setShowSearchView={setShowSearchView}
          />
        </CustomModalScreen>
      )}
    </>
  );
}
