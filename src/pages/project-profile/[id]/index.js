import "swiper/css";
import "swiper/css/thumbs";
import Link from "next/link";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import Image from "next/image";
import "swiper/css/pagination";
import { Share } from "@lib/svg";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { getCookie } from "cookies-next";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useWindowSize } from "@uidotdev/usehooks";
import { Swiper, SwiperSlide } from "swiper/react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { Flag, Verify, ArrowRight2, Home2 } from "iconsax-react";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { Autoplay, Pagination, FreeMode, Navigation, Thumbs } from "swiper";
import { useState, useEffect, useCallback, useRef, useReducer } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//FUNCTION
import { getDate } from "@functions/getDate";
import { getJustTime } from "@functions/getJustTime";
import { saveToStorage } from "@functions/saveToStorage";
import { getFromStorage } from "@functions/getFromStorage";
import { removeQueryParam } from "@functions/removeQueryParam";
//GQL
import { GET_COMMENTS } from "@services/gql/query/GET_COMMENTS";
import { GET_SINGLE_PROJECT } from "@services/gql/query/GET_SINGLE_PROJECT";
//COMPONENT
import ShowTags from "@components/common/ShowTags";
import Loading from "@components/kit/loading/Loading";
import BackButton from "@components/common/BackButton";
import ShowMoreText from "@components/common/ShowMoreText";
import Score from "@components/pages/project-profile/Score";
import CustomButton from "@components/kit/button/CustomButton";
import { isAndroid, isDesktop, isIOS } from "react-device-detect";
import SquareBoxWithIcon from "@components/common/SquareBoxWithIcon";
import StatisticsTable from "@components/pages/project-profile/StatisticsTable";
import RequirementSlides from "@components/pages/project-profile/RequirementSlides";
import ProjectProfileSkeleton from "@components/common/skeleton/ProjectProfileSkeleton";
import ReadMore from "@components/common/ReadMore";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const Login = dynamic(() => import("@components/common/login/Main"), { ssr: false });
const ShareModal = dynamic(() => import("@components/common/ShareModal"), { ssr: false });
const CommentCard = dynamic(() => import("@components/common/CommentCard"), { ssr: false });
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const CustomModal = dynamic(() => import("@components/kit/modal/CustomModal"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });
const ImageViewerModal = dynamic(() => import("@components/common/ImageViewerModal"), {
  ssr: false,
});
const ViolationReportBottomSheet = dynamic(
  () => import("@components/common/ViolationReportBottomSheet"),
  { ssr: false }
);
const ParticipationStatus = dynamic(
  () => import("@components/pages/project-profile/ParticipationStatus"),
  { ssr: false }
);
const BookMarkButton = dynamic(() => import("@components/common/BookMark"), {
  ssr: false,
});
const ShowLocation = dynamic(() => import("@components/common/ShowLocation"), {
  ssr: false,
});
const CommentForm = dynamic(() => import("@components/pages/project-profile/CommentForm"), {
  ssr: false,
});
const CustomTransitionModal = dynamic(() => import("@components/kit/modal/CustomTransitionModal"), {
  ssr: false,
});

const INITIAL_LIMIT_OF_COMMENTS = 3;
const LIMIT_OF_COMMENTS = 10;

const initialState = {
  page: 0,
  result: null,
  comments: [],
  currentImage: 0,
  isViewerOpen: false,
  shareHintModal: false,
  openShareModal: false,
  newCommentCreated: false,
  gatewayPaymentStatus: null,
  openParticipationStatusModal: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "shareHintModal":
      return {
        ...state,
        shareHintModal: action.payload,
      };
    case "openShareModal":
      return {
        ...state,
        openShareModal: action.payload,
      };
    case "result":
      return {
        ...state,
        result: action.payload,
      };
    case "comments":
      return {
        ...state,
        comments: action.payload,
      };
    case "newCommentCreated":
      return {
        ...state,
        newCommentCreated: action.payload,
      };
    case "page":
      return {
        ...state,
        page: state.page + action.payload,
      };
    case "imageAndViewer":
      return {
        ...state,
        currentImage: action.payload.index,
        isViewerOpen: action.payload.isOpen,
      };
    case "gatewayPaymentStatus":
      return {
        ...state,
        gatewayPaymentStatus: action.payload,
      };
    case "openParticipationStatusModal":
      return {
        ...state,
        openParticipationStatusModal: action.payload,
      };
    default:
      return state;
  }
}

export default function ProjectProfilePage({ params }) {
  //VARIABLE
  const { t } = useTranslation();
  const lang = getCookie("NEXT_LOCALE");
  const dir = lang == "ar" ? "rtl" : "ltr";
  const router = useRouter();
  const currentUserId = useSelector((state) => state.token._id);
  const size = useWindowSize();
  const titleRef = useRef();
  const [
    {
      page,
      result,
      comments,
      isViewerOpen,
      currentImage,
      shareHintModal,
      openShareModal,
      newCommentCreated,
      gatewayPaymentStatus,
      openParticipationStatusModal,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const [openViolationReportBottomSheet, setOpenViolationReportBottomSheet] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [openScore, setOpenScore] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //API
  const { loading, error, data, refetch } = useQuery(GET_SINGLE_PROJECT, {
    fetchPolicy: "no-cache",
    variables: {
      id: `${params?.id}`,
    },
  });

  let [getComments, { loading: getCommentsLoading, data: getCommentsData, fetchMore }] =
    useLazyQuery(GET_COMMENTS);

  //FUNCTION
  useEffect(() => {
    getComments({
      variables: {
        targetType: "PROJECT",
        targetId: `${params?.id}`,
        limit: INITIAL_LIMIT_OF_COMMENTS,
        page: 0,
      },
      fetchPolicy: "no-cache",
    }).then(({ data }) => {
      addToComments(data?.get_comments.result);
    });
  }, []);
  useEffect(() => {
    if (gatewayPaymentStatus == 0) {
      dispatch({ type: "openParticipationStatusModal", payload: true });
    } else if (gatewayPaymentStatus == 1) {
      dispatch({ type: "openParticipationStatusModal", payload: true });
    }
  }, [gatewayPaymentStatus]);

  useEffect(() => {
    if (router.query.isOk == "0") {
      dispatch({ type: "gatewayPaymentStatus", payload: 0 });
    } else if (router.query.isOk == "1") {
      dispatch({ type: "gatewayPaymentStatus", payload: 1 });
    } else {
      dispatch({ type: "gatewayPaymentStatus", payload: 2 });
    }
  }, [router.query]);

  useEffect(() => {
    if (titleRef.current && !!router.query.isOk) {
      removeQueryParam();
    }
  }, [titleRef.current]);

  useEffect(() => {
    if (getFromStorage("participationResult") == 1) {
      dispatch({ type: "gatewayPaymentStatus", payload: 1 });
    } else if (getFromStorage("participationResult") == 0) {
      dispatch({ type: "gatewayPaymentStatus", payload: 0 });
    }
  }, []);

  useEffect(() => {
    dispatch({ type: "result", payload: data?.getSingleProject });
    const expiresDate = localStorage.getItem(`seenShareHintDate-${params.id}`); //milliseconds
    const seenProject = expiresDate && expiresDate > new Date().getTime();
    let timeoutId;
    if (data && !seenProject && data.getSingleProject.projectStatus.status !== "PENDING") {
      timeoutId = setTimeout(() => {
        dispatch({ type: "shareHintModal", payload: true });
        localStorage.removeItem(`seenShareHintDate-${params.id}`);
      }, 30 * 1000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [data]);

  useEffect(() => {
    if (params?.id && shareHintModal) {
      const expiresDate = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hour from now, base on milliseconds
      saveToStorage(`seenShareHintDate-${params.id}`, expiresDate);
    }
  }, [shareHintModal, params?.id]);

  const addToComments = (newComments = [], addTopOfList = false) => {
    //addTopOfList is true when new comment create in commentForm
    if (addTopOfList) {
      dispatch({ type: "comments", payload: [newComments, ...comments] });
      dispatch({ type: "newCommentCreated", payload: true });
    } else {
      // in this page(profile-project),in page 0, newComment should replace already comments
      page === 0
        ? dispatch({ type: "comments", payload: [...newComments] })
        : dispatch({ type: "comments", payload: [...comments, ...newComments] });
    }
  };

  useEffect(() => {
    if (newCommentCreated) {
      toast.custom(() => <Toast text={t("successfulCommentToast")} />);
      dispatch({ type: "newCommentCreated", payload: false });
    }
  }, [newCommentCreated]);

  const fetchingMore = () => {
    fetchMore({ variables: { page, limit: LIMIT_OF_COMMENTS } })
      .then(({ data }) => {
        addToComments(data.get_comments.result);
        dispatch({ type: "page", payload: 1 });
      })
      .catch((e) => console.error("error", e));
  };

  const openImageViewer = useCallback((index) => {
    document.body.style.overflow = "hidden";
    router.push(`/project-profile/${params.id}?gallery=open`);
    dispatch({ type: "imageAndViewer", payload: { index, isOpen: true } });
  }, []);

  const handleCloseImageViewerWithBackButton = () => {
    if (router.query?.gallery === "open") {
      document.body.style.overflow = "unset";
      dispatch({ type: "imageAndViewer", payload: { index: 0, isOpen: false } });
    }
  };

  useEffect(() => {
    window.addEventListener("popstate", handleCloseImageViewerWithBackButton);
    return () => window.removeEventListener("popstate", handleCloseImageViewerWithBackButton);
  });

  const OpenMap = () => {
    const { lat, lon } = result.location.geo;
    if (isDesktop) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
      window.open(googleMapsUrl, "_blank");
    } else if (isAndroid) {
      const AndroidMapsUrl = `geo:0,0?q=${lat},${lon}`;
      window.open(AndroidMapsUrl, "_blank");
    } else if (isIOS) {
      const IOSMapsUrl = `maps://0,0?q=${lat},${lon}`;
      window.open(IOSMapsUrl, "_blank");
    }
  };

  const audience = result?.associationObject.audience;
  const status = result?.projectStatus?.status;
  const donateDisabled =
    status === "PAUSEDBYADMIN" ||
    status === "PAUSEDBYUSER" ||
    status === "ARCHIVED" ||
    status === "PENDING";

  //JSX
  if (
    result &&
    result.creator._id !== currentUserId &&
    (result.projectStatus?.status === "PENDING" ||
      result.projectStatus?.status === "PAUSEDBYUSER" ||
      result.projectStatus?.status === "SUSPENDED")
  ) {
    router.push("/404", undefined, { shallow: true });
  }

  if (error) router.push("/404", undefined, { shallow: true });
  // eslint-disable-next-line valid-typeof
  if (loading || !result || typeof gatewayPaymentStatus === null || isLoading)
    return <ProjectProfileSkeleton />;
  return (
    <>
      <NextSeo title={result.title} description={result?.description} />

      <section className="pb-[100px] px-4 lg:max-w-[1320px] 2xl:m-auto">
        {size.width < 960 && (
          <div className="flex justify-between items-center py-[24px] relative ">
            <div className="flex items-center gap-x-[10px]">
              <BackButton
                arrowColor="#03A6CF"
                bgColor="bg-main8"
                onClick={() => {
                  toast.remove();
                  router.back();
                }}
                iconSize={18}
                width="w-[32px]"
                height="h-[32px]"
                dir={dir === "ltr" ? "left" : "right"}
              />
              <SquareBoxWithIcon
                size="31px"
                classNames="bg-main8 rounded-full cursor-pointer"
                onClick={() => {
                  router.push("/", undefined, { shallow: true });
                }}
                icon={<Home2 size="16" color="#03A6CF" />}
              />
            </div>
            <div className={`flex items-center gap-x-[10px] rtl:flex-row ltr:flex-row-reverse`}>
              <SquareBoxWithIcon
                size="31px"
                classNames="bg-main8 rounded-full cursor-pointer"
                onClick={() => {
                  dispatch({ type: "openShareModal", payload: true });
                }}
                icon={<Share />}
              />
              <SquareBoxWithIcon
                size="31px"
                classNames="bg-main8 rounded-full cursor-pointer"
                onClick={() => {
                  setOpenViolationReportBottomSheet(true);
                }}
                icon={<Flag size="16" color="#03A6CF" />}
              />
              {result.bookmarkable && (
                <SquareBoxWithIcon
                  size="31px"
                  classNames="bg-main8 rounded-full cursor-pointer"
                  icon={
                    <BookMarkButton
                      id={result._id}
                      haveIBookmarked={result.haveIBookmarked}
                      refetch={refetch}
                      color={"blue"}
                      type={"PROJECT"}
                    />
                  }
                />
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:w-full lg:flex-row lg:mt-8 ">
          <div className="lg:w-[60%] relative lg:mb-[30px]">
            {size.width > 960 && (
              <div className={`absolute right-[14px] top[14px] z-50 mt-2`}>
                <div className="flex flex-row gap-x-2">
                  <SquareBoxWithIcon
                    size="31px"
                    classNames="bg-gray7 rounded-full cursor-pointer"
                    onClick={() => {
                      dispatch({ type: "openShareModal", payload: true });
                    }}
                    icon={<Share color={"#2E2E2E"} />}
                  />
                  <SquareBoxWithIcon
                    size="31px"
                    classNames="bg-gray7 rounded-full cursor-pointer"
                    onClick={() => {
                      setOpenViolationReportBottomSheet(true);
                    }}
                    icon={<Flag size="16" />}
                  />
                  {result.bookmarkable && (
                    <SquareBoxWithIcon
                      size="31px"
                      classNames="bg-gray7 rounded-full cursor-pointer"
                      icon={
                        <BookMarkButton
                          id={result._id}
                          haveIBookmarked={result.haveIBookmarked}
                          refetch={refetch}
                          color={"#2E2E2E"}
                          type={"PROJECT"}
                        />
                      }
                    />
                  )}
                </div>
              </div>
            )}
            {result.imgs?.length > 0 ? (
              <>
                <Swiper
                  style={{
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                  }}
                  spaceBetween={10}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  thumbs={{ swiper: thumbsSwiper?.slides ? thumbsSwiper : null }}
                  modules={[Autoplay, Pagination, FreeMode, Navigation, Thumbs]}
                  className={` aspect-video ${
                    size.width > 700
                      ? "mySwiper2-top-of-profileProject-md"
                      : size.width > 960
                      ? "mySwiper2-top-of-profileProject-lg"
                      : "mySwiper2-top-of-profileProject"
                  }`}
                >
                  {result.imgs?.map((imgSrc, i) => (
                    <SwiperSlide key={"mySwiper2-top-of-profileProject" + i}>
                      <div className="unset-img" onClick={() => openImageViewer(i)}>
                        <Image
                          alt="profile-image"
                          src={imgSrc}
                          layout="fill"
                          className="custom-img"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                {result.imgs?.length > 1 && (
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={size.width > 960 ? 20 : 8}
                    slidesPerView="auto"
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className={`${
                      size.width > 700
                        ? "mySwiper-top-of-profileProject-md"
                        : size.width > 960
                        ? "mySwiper-top-of-profileProject-lg"
                        : "mySwiper-top-of-profileProject"
                    }`}
                  >
                    {result.imgs?.map((imgSrc, i) => (
                      <SwiperSlide key={"mySwiper-top-of-profileProject" + i}>
                        <div className="unset-img" onClick={() => openImageViewer(i)}>
                          <Image
                            alt="profile-image"
                            src={imgSrc}
                            layout="fill"
                            className="custom-img"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </>
            ) : (
              <div
                className={`relative flex justify-center items-center  overflow-hidden ${
                  result.description?.length > 260
                    ? "h-[158px] lg:h-[340px]"
                    : "h-[158px] lg:h-[285px]"
                }  rounded-[14px]`}
              >
                <Image
                  alt="project"
                  src={"/assets/images/default-project-card-image.png"}
                  layout="fill"
                  className="cover-center-img"
                />
              </div>
            )}
          </div>

          <div className="mb-[28px] mt-[20px] lg:mt-0 lg:w-[40%] lg:ltr:ml-[40px] lg:rtl:mr-[40px] ">
            <h4 className="heading text-black lg:text-[24px] lg:font-bold lg:pt-1" ref={titleRef}>
              {result.title}
            </h4>
            <div className="flex flex-row mt-2 gap-1 caption1 lg:text-[20px] lg:font-normal lg:pt-3 text-gray3">
              <span>{t("project-profile.projectBy") + " :"}</span>
              <Link
                href={
                  result.isAssignedTo
                    ? "/my-profile"
                    : `/association-profile/${result.creator?._id}`
                }
                prefetch={false}
                className="flex items-center flex-row gap-[7px]"
              >
                <h4 className="font-semibold underline text-main2">{result.creator?.name}</h4>
                {result.creator?.verifyBadge && (
                  <Verify size="14" color="#2889d7" variant="Bold" className="shrink-0 mt-1" />
                )}
              </Link>
            </div>
            {size.width > 960 && (
              <div className="mb-[22px]">
                <h1 className="heading text-black mb-[21px] text-center lg:text-[22px] lg:font-bold lg:pt-9 lg:ltr:text-left lg:rtl:text-right">
                  {t("overView")}
                </h1>
                <div className="flex flex-col caption1 mb-3 lg:text-[18px] lg:font-normal">
                  {(result.subjects?.length > 0 || result.subjectOtherDescription) && (
                    <div className="flex flex-row flex-wrap items-center">
                      <span
                        className="w-[9px] h-[9px] bg-black rounded-sm"
                        style={{ transform: "matrix(-1, 0, 0, 1, 0, 0)" }}
                      />
                      <span className=" rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                        {t("project-profile.overView.subject")}.
                      </span>
                      {result.subjects?.length > 0 ? (
                        <Link
                          href={`/search?source=project&sort=MOST_VISIT_COUNT&subjects=${result.subjects[0]?._id}`}
                          className="rtl:mr-1 ltr:ml-1 my-2 underline text-main2 cursor-pointer"
                          prefetch={false}
                        >
                          {result.subjects[0]?.name}
                        </Link>
                      ) : (
                        <span className="rtl:mr-1 ltr:ml-1 text-black my-2">{t("other")}</span>
                      )}
                    </div>
                  )}
                  {(result.associationObject?.startDate || result.associationObject?.endDate) && (
                    <>
                      <div className="flex flex-row items-center">
                        <span
                          className="w-[9px] h-[9px] bg-black rounded-sm"
                          style={{ transform: "matrix(-1, 0, 0, 1, 0, 0)" }}
                        />
                        <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                          {t("project-profile.overView.startDate")}.
                        </span>
                        <span className="rtl:mr-1 ltr:ml-1 text-black">
                          {result.associationObject?.startDate
                            ? getDate(result.associationObject?.startDate, lang)
                            : "----"}
                        </span>
                        <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                          {<ArrowRight2 size="12" />}
                        </span>
                        <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                          {t("project-profile.overView.endDate")}.
                        </span>
                        <span className="rtl:mr-1 ltr:ml-1 text-black">
                          {result.associationObject?.endDate
                            ? getDate(result.associationObject?.endDate, lang)
                            : "----"}
                        </span>
                      </div>
                      <div className="flex flex-row items-center lg:pt-3">
                        <span
                          className="w-[9px] h-[9px] bg-black rounded-sm"
                          style={{ transform: "matrix(-1, 0, 0, 1, 0, 0)" }}
                        />
                        <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                          {t("project-profile.overView.startTime")}.
                        </span>
                        <span className="rtl:mr-1 ltr:ml-1 text-black">
                          {result.associationObject?.startDate
                            ? getJustTime(result.associationObject?.startDate, lang)
                            : "----"}
                        </span>
                        <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                          {<ArrowRight2 size="12" />}
                        </span>
                        <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                          {t("project-profile.overView.endTime")}.
                        </span>
                        <span className="rtl:mr-1 ltr:ml-1 text-black">
                          {result.associationObject.endDate
                            ? getJustTime(result.associationObject?.endDate, lang)
                            : "----"}
                        </span>
                      </div>
                    </>
                  )}

                  {(audience?.gender || audience?.maxAge || audience?.minAge) && (
                    <div className="flex flex-row flex-wrap items-center  lg:pt-3">
                      <div className="flex flex-row items-center">
                        <span
                          className="w-[9px] h-[9px] bg-black rounded-sm"
                          style={{ transform: "matrix(-1, 0, 0, 1, 0, 0)" }}
                        />
                        <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                          {t("project-profile.overView.targetAudienceCommunity")}.
                        </span>
                      </div>
                      <div className="flex flex-row ">
                        {audience?.gender && (
                          <span className="rtl:mr-1 ltr:ml-1 text-black">
                            {t(
                              `project-profile.overView.${String(audience?.gender).toLowerCase()}`
                            )}
                          </span>
                        )}
                        {audience?.minAge && (
                          <span className="rtl:mr-1 ltr:ml-1 text-black">{audience?.minAge}</span>
                        )}
                        {audience?.maxAge !== audience?.minAge && (
                          <>
                            <span className="rtl:mr-1 ltr:ml-1 text-black">{"/"}</span>
                            <span className="rtl:mr-1 ltr:ml-1 text-black">{audience?.maxAge}</span>
                          </>
                        )}
                        {(audience?.minAge || audience?.maxAge) && (
                          <span className="rtl:mr-1 ltr:ml-1 text-black">
                            {t("project-profile.overView.age")}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {result.description && (
                  <ReadMore
                    text={result.description}
                    lineCount={3}
                    textAlign={"ltr:text-left rtl:text-right"}
                  />
                )}

                {!donateDisabled && (
                  <Link
                    href={`/participation/${result._id}?tab=1`}
                    className="block w-[100%] h-[100%] mt-6"
                    prefetch={false}
                  >
                    <button
                      className="block bg-main2 rounded-lg cta3 text-white w-full h-[40px]"
                      onClick={() => dispatch({ type: "isLoading", payload: true })}
                    >
                      {t("project-profile.donateNow")}
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        {result.requirements?.length > 0 && (
          <RequirementSlides
            isRequest={false}
            projectId={result._id}
            donateDisabled={donateDisabled}
            requirements={result.requirements}
            projectRequirementData={result.projectRequirementData}
            financialRequirement={
              result?.requirements.filter((item) => item.type === "FINANCIAL")[0]?.amount
            }
            dir={dir}
          />
        )}
        {size.width < 960 && (
          <div className="mb-[22px] mt-[30px]">
            <h1 className="heading text-black mb-[21px] text-center">{t("overView")}</h1>
            <div className="flex flex-col caption1 mb-3">
              {(result.subjects?.length > 0 || result.subjectOtherDescription) && (
                <div className="flex flex-row flex-wrap items-center">
                  <span
                    className="w-[9px] h-[9px] bg-black rounded-sm"
                    style={{ transform: "matrix(-1, 0, 0, 1, 0, 0)" }}
                  />
                  <span className=" rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                    {t("project-profile.overView.subject")}.
                  </span>
                  {result.subjects?.length > 0 ? (
                    <Link
                      href={`/search?source=project&sort=MOST_VISIT_COUNT&subjects=${result.subjects[0]?._id}`}
                      className="rtl:mr-1 ltr:ml-1 underline text-main2 cursor-pointer"
                      prefetch={false}
                    >
                      {result.subjects[0]?.name}
                    </Link>
                  ) : (
                    <span className="rtl:mr-1 ltr:ml-1 text-black my-2">{t("other")}</span>
                  )}
                </div>
              )}
              {(result.associationObject?.startDate || result.associationObject?.endDate) && (
                <>
                  <div className="flex flex-row items-center">
                    <span
                      className="w-[9px] h-[9px] bg-black rounded-sm"
                      style={{ transform: "matrix(-1, 0, 0, 1, 0, 0)" }}
                    />
                    <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                      {t("project-profile.overView.startDate")}.
                    </span>
                    <span className="rtl:mr-1 ltr:ml-1 text-black">
                      {result.associationObject?.startDate
                        ? getDate(result.associationObject.startDate, lang)
                        : "----"}
                    </span>
                    <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                      {<ArrowRight2 size="12" />}
                    </span>
                    <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                      {t("project-profile.overView.endDate")}.
                    </span>
                    <span className="rtl:mr-1 ltr:ml-1 text-black">
                      {result.associationObject?.endDate
                        ? getDate(result.associationObject.endDate, lang)
                        : "----"}
                    </span>
                  </div>
                  <div className="flex flex-row items-center ">
                    <span
                      className="w-[9px] h-[9px] bg-black rounded-sm"
                      style={{ transform: "matrix(-1, 0, 0, 1, 0, 0)" }}
                    />
                    <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                      {t("project-profile.overView.startTime")}.
                    </span>
                    <span className="rtl:mr-1 ltr:ml-1 text-black">
                      {result.associationObject?.startDate
                        ? getJustTime(result.associationObject?.startDate, lang)
                        : "----"}
                    </span>
                    <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                      {<ArrowRight2 size="12" />}
                    </span>
                    <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                      {t("project-profile.overView.endTime")}.
                    </span>
                    <span className="rtl:mr-1 ltr:ml-1 text-black">
                      {result.associationObject?.endDate
                        ? getJustTime(result.associationObject?.endDate, lang)
                        : "----"}
                    </span>
                  </div>
                </>
              )}

              {(audience?.gender || audience?.maxAge || audience?.minAge) && (
                <div className="flex flex-row flex-wrap items-center">
                  <div className="flex flex-row items-center">
                    <span
                      className="w-[9px] h-[9px] bg-black rounded-sm"
                      style={{ transform: "matrix(-1, 0, 0, 1, 0, 0)" }}
                    />
                    <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">
                      {t("project-profile.overView.targetAudienceCommunity")}.
                    </span>
                  </div>
                  <div className="flex flex-row ">
                    {audience?.gender && (
                      <span className="rtl:mr-1 ltr:ml-1 text-black">
                        {t(`project-profile.overView.${String(audience?.gender).toLowerCase()}`)}
                      </span>
                    )}
                    {audience?.minAge && (
                      <span className="rtl:mr-1 ltr:ml-1 text-black">{audience?.minAge}</span>
                    )}
                    {audience?.maxAge !== audience?.minAge && (
                      <>
                        <span className="rtl:mr-1 ltr:ml-1 text-black">{"/"}</span>
                        <span className="rtl:mr-1 ltr:ml-1 text-black">{audience?.maxAge}</span>
                      </>
                    )}
                    {(audience?.minAge || audience?.maxAge) && (
                      <span className="rtl:mr-1 ltr:ml-1 text-black">
                        {t("project-profile.overView.age")}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            {result.description && (
              <ReadMore
                text={result.description}
                lineCount={3}
                textAlign={"ltr:text-left rtl:text-right"}
              />
            )}
          </div>
        )}

        {result.tags && <ShowTags tags={result.tags} classNames="mt-4" />}

        {result.location?.geo?.lat && (
          <div
            className="w-full h-[204px] mt-[30px] mb-[50px] showLocation z-9-forShowLocation"
            onClick={() => {
              OpenMap();
            }}
          >
            <ShowLocation lat={result.location.geo?.lat} lng={result.location.geo?.lon} zoom={5} />
          </div>
        )}

        <StatisticsTable
          t={t}
          classNames="mt-[34px] mx-[4px]"
          title={t("project-profile.statistics.tHeader")}
          array={[
            { title: t("project-profile.statistics.donator"), count: result.participationCount },
            {
              title: t("project-profile.statistics.donated"),
              count: result.participationStatistics?.total,
            },
          ]}
        />

        <div className="mt-[40px]">
          <h1 className="heading text-black text-center mb-[40px] lg:text-[24px]">
            {t("comments")}
          </h1>
          <CommentForm
            classNames="mb-[44px]"
            dir={dir}
            targetId={result._id}
            targetType="PROJECT"
            addToComments={addToComments}
          />
          {comments.length > 0 && (
            <h1 className="mt-[44px] mb-[33px] heading text-black text-center lg:text-[24px]">
              {t("project-profile.peopleComments")}
            </h1>
          )}
          {comments.length > 0 && (
            <div className="flex flex-col gap-3">
              {comments.map((item, i) => (
                <CommentCard
                  setIsLoading={setIsLoading}
                  key={"commentCard" + i}
                  data={item}
                  classNames="mb-[30px]"
                  maxText={false}
                  setShowLogin={setShowLogin}
                />
              ))}
            </div>
          )}
          {comments.length < getCommentsData?.get_comments.total && (
            <>
              {!getCommentsLoading ? (
                <div className="flex justify-center items-center mt-[32px]">
                  <button
                    className="bg-main8 titleInput text-main2 rounded-lg w-[121px] h-[40px] lg:w-[214px] lg:h-[48px] "
                    onClick={fetchingMore}
                  >
                    {t("seeMore")}
                  </button>
                </div>
              ) : (
                <Loading loadingHeight="100px" />
              )}
            </>
          )}
        </div>
      </section>

      {!donateDisabled && size.width < 960 && (
        <div
          className="flex justify-center items-center sticky bottom-0 z-10 h-[63px] px-4 py-3"
          style={{ background: "#FFFFFF", boxShadow: "0 -4px 4px rgba(228, 228, 228, 0.25)" }}
        >
          <Link
            href={`/participation/${result._id}?tab=1`}
            className="block w-[100%] h-[100%]"
            prefetch={false}
          >
            <button className="block bg-main2 rounded-lg cta3 text-white w-full h-[40px]">
              {t("project-profile.donateNow")}
            </button>
          </Link>
        </div>
      )}
      {data?.getSingleProject?.projectStatus?.status === "ARCHIVED" &&
        !data?.getSingleProject?.haveIRated &&
        data?.getSingleProject?.IhadActivity && (
          <div
            className="flex flex-row-reverse justify-between items-center w-full  sticky bottom-0 z-10 h-[63px] px-4 py-3"
            style={{ background: "#DCF1F7" }}
          >
            <CustomButton
              title={t("score")}
              size={"X"}
              width={"w-[70px]"}
              onClick={() => {
                setOpenScore(true);
              }}
            />
            <p className="title1 text-main2">{t("project-profile.giveOpinion")}</p>
          </div>
        )}
      <CustomModal
        title={t("project-profile.shareHintTitle")}
        description={t("project-profile.shareHintDesc")}
        openState={shareHintModal}
        oneButtonOnClick={() => dispatch({ type: "openShareModal", payload: true })}
        hasOneButton={true}
        icon={
          <div className="flex items-center justify-center rounded-full bg-[#03A7CC14] w-[72px] h-[72px]">
            <Share w="29" h="30" color="#03A6CF" />
          </div>
        }
        oneButtonLabel={t("project-profile.shareHint")}
        hasCloseBtn={true}
        cancelOnClick={() => dispatch({ type: "shareHintModal", payload: false })}
      />
      <ShareModal
        t={t}
        data={data?.getSingleProject}
        open={openShareModal}
        shareLink={`${process.env.NEXT_PUBLIC_PUBLISH_DOMAIN}/${lang}/project-profile/${result._id}`}
        close={() => {
          dispatch({ type: "openShareModal", payload: false });
          dispatch({ type: "shareHintModal", payload: false });
          toast.remove();
        }}
      />
      <ViolationReportBottomSheet
        lang={lang}
        t={t}
        setOpenViolationReportBottomSheet={setOpenViolationReportBottomSheet}
        openViolationReportBottomSheet={openViolationReportBottomSheet}
        targetType="PROJECT"
        targetId={result._id}
      />

      <CustomTransitionModal
        open={openParticipationStatusModal}
        close={() => {
          dispatch({ type: "openParticipationStatusModal", payload: false });
          saveToStorage("participationResult", null);
          saveToStorage("participationType", null);
        }}
        width={"320px"}
        hasCloseBtn={true}
      >
        <ParticipationStatus
          t={t}
          isOk={gatewayPaymentStatus === 1}
          projectId={params.id}
          typeOfParticipation={getFromStorage("participationType")}
          openShareModal={() => {
            dispatch({ type: "openShareModal", payload: true });
            dispatch({ type: "openParticipationStatusModal", payload: false });
            saveToStorage("participationResult", null);
            saveToStorage("participationType", null);
          }}
          closeThisModal={() => {
            dispatch({ type: "openParticipationStatusModal", payload: false });
            saveToStorage("participationResult", null);
            saveToStorage("participationType", null);
          }}
        />
      </CustomTransitionModal>

      <BottomSheet open={openScore} setOpen={setOpenScore}>
        <Score data={result} setOpen={setOpenScore} refetch={refetch} t={t} />
      </BottomSheet>

      {isViewerOpen && (
        <ImageViewerModal
          imgs={result.imgs}
          currentImage={currentImage}
          open={isViewerOpen}
          setOpen={(isOpen) => dispatch({ type: "imageAndViewer", payload: isOpen })}
        />
      )}

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
  const apolloClient = initializeApollo();
  return addApolloState(apolloClient, {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      params,
    },
  });
};
