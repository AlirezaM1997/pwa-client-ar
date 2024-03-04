import "swiper/css";
import "swiper/css/thumbs";
import Head from "next/head";
import Link from "next/link";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Share } from "@lib/svg";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useTranslation } from "next-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { useWindowSize } from "@uidotdev/usehooks";
import Image from "next/image";
import { Flag, Home2, Verify } from "iconsax-react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useState, useEffect, useCallback } from "react";
import { addApolloState, initializeApollo } from "@services/apollo-client";
import { Autoplay, Pagination, FreeMode, Navigation, Thumbs } from "swiper";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
//FUNCTION
import { getDate } from "@functions/getDate";
import { getJustTime } from "@functions/getJustTime";
//GQL
import { GET_COMMENTS } from "@services/gql/query/GET_COMMENTS";
import { GET_SINGLE_PROJECT_REQUEST } from "@services/gql/query/GET_SINGLE_PROJECT_REQUEST";
//COMPONENT
import ShowTags from "@components/common/ShowTags";
import Loading from "@components/kit/loading/Loading";
import BackButton from "@components/common/BackButton";
import ShowMoreText from "@components/common/ShowMoreText";
import Score from "@components/pages/project-profile/Score";
import { isAndroid, isDesktop, isIOS } from "react-device-detect";
import SquareBoxWithIcon from "@components/common/SquareBoxWithIcon";
import RequirementSlides from "@components/pages/project-profile/RequirementSlides";
import RequestProfileSkeleton from "@components/common/skeleton/RequestProfileSkeleton";
// COMPONENT DYNAMIC IMPORT
const Toast = dynamic(() => import("@components/kit/toast/Main"), { ssr: false });
const ShareModal = dynamic(() => import("@components/common/ShareModal"), { ssr: false });
const BottomSheet = dynamic(() => import("@components/common/BottomSheet"), { ssr: false });
const CommentCard = dynamic(() => import("@components/common/CommentCard"), { ssr: false });
const ViolationReportBottomSheet = dynamic(
  () => import("@components/common/ViolationReportBottomSheet"),
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
const ImageViewerModal = dynamic(() => import("@components/common/ImageViewerModal"), { ssr: false });

const INITIAL_LIMIT_OF_COMMENTS = 3;
const LIMIT_OF_COMMENTS = 10;

export default function ProjectRequestProfilePage({ params }) {
  const { t } = useTranslation();
  const lang = getCookie("NEXT_LOCALE");
  const dir = lang == "ar" ? "rtl" : "ltr";
  const router = useRouter();
  const size = useWindowSize();

  const [openShareBottomSheet, setOpenShareBottomSheet] = useState(false);
  const [openViolationReportBottomSheet, setOpenViolationReportBottomSheet] = useState(false);
  const [result, setResult] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentCreated, setNewCommentCreated] = useState(false);
  const [page, setPage] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [openScore, setOpenScore] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [showFullScreenMap, setShowFullScreenMap] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_SINGLE_PROJECT_REQUEST, {
    fetchPolicy: "no-cache",
    variables: {
      id: `${params?.id}`,
    },
  });

  useEffect(() => {
    setResult(data?.getSingleProjectRequest);
  }, [data]);

  let [getComments, { loading: getCommentsLoading, data: getCommentsData, fetchMore }] =
    useLazyQuery(GET_COMMENTS);

  const addToComments = (newCommnets = [], addTopOfList = false) => {
    //addTopOfList is true when new comment create in commentForm
    if (addTopOfList) {
      setComments([newCommnets, ...comments]);
      setNewCommentCreated(true);
    } else {
      // in this page(profile-project),in page 0, newComment should replace already comments
      page === 0 ? setComments([...newCommnets]) : setComments([...comments, ...newCommnets]);
    }
  };

  useEffect(() => {
    if (newCommentCreated) {
      toast.custom(() => <Toast text={t("successfulCommentToast")} />);
      setNewCommentCreated(false);
    }
  }, [newCommentCreated]);

  useEffect(() => {
    getComments({
      variables: {
        targetType: "PROJECT_REQUEST",
        targetId: `${params?.id}`,
        limit: INITIAL_LIMIT_OF_COMMENTS,
        page: 0,
      },
      fetchPolicy: "no-cache",
    }).then(({ data }) => {
      addToComments(data?.get_comments.result);
    });
  }, []);

  const fetchingMore = () => {
    fetchMore({ variables: { page, limit: LIMIT_OF_COMMENTS } })
      .then(({ data }) => {
        addToComments(data.get_comments.result);
        setPage(page + 1);
      })
      .catch((e) => console.error("error", e));
  };

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
  }, []);

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

  const audience = result?.associationObject?.audience;
  const donateDisabled = result?.projectStatus?.status === "END";

  if (error) {
    if (
      error.message === "bad request: no such projectRequest found" ||
      error.message === "Something bad happend"
    ) {
      router.push("/404", undefined, { shallow: true });
    } else return <h5>{error.message}</h5>;
  }

  if (loading || !result) return <RequestProfileSkeleton />;
  return (
    <>
      <Head>
        <title>{data?.getSingleProjectRequest.title}</title>
      </Head>
      <section className="pb-[100px] px-4 lg:max-w-[1320px] 2xl:m-auto" dir={dir}>
        {size.width < 960 && (
          <div className="flex justify-between items-center py-[24px] relative ">
            <div className="flex items-center gap-x-[10px] ">
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
                  setOpenShareBottomSheet(true);
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
                      type={"REQUEST"}
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
              <div className={`absolute right-[14px] top[14px]   z-50 mt-2`}>
                <div className="flex flex-row gap-x-2">
                  <SquareBoxWithIcon
                    size="31px"
                    classNames="bg-gray7 rounded-full cursor-pointer"
                    onClick={() => {
                      setOpenShareBottomSheet(true);
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
                          type={"REQUEST"}
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
                  className={`aspect-video ${
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
                    className={
                      size.width > 700
                        ? "mySwiper-top-of-profileProject-md"
                        : size.width > 960
                        ? "mySwiper-top-of-profileProject-lg"
                        : "mySwiper-top-of-profileProject"
                    }
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
            <h4 className="heading text-black lg:text-[24px] lg:font-bold lg:pt-1">
              {result.title}
            </h4>
            <div className="flex flex-row mt-2 gap-1 caption1 lg:text-[20px] lg:font-normal lg:pt-3 text-gray3">
              <span>{t("project-profile.requestBy") + " :"}</span>
              <div className="flex items-center flex-row gap-[7px]">
                <h4>{result.creator?.name}</h4>
                {result.creator?.verifyBadge && (
                  <Verify size="14" color="#2889d7" variant="Bold" className="shrink-0 mt-1" />
                )}
              </div>
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
                          href={`/search?source=request&sort=LATEST&subjects=${result.subjects[0]?._id}`}
                          className="rtl:mr-1 ltr:ml-1 text-main2 underline my-2"
                          prefetch={false}
                        >
                          {result.subjects[0]?.name}
                        </Link>
                      ) : (
                        <span className="rtl:mr-1 ltr:ml-1 text-black my-2">{t("other")}</span>
                        // <div className="w-full">
                        //   <ShowMoreText
                        //     text={result.subjectOtherDescription}
                        //     length={30}
                        //     wrapperTextAlign={"ltr:text-left rtl:text-right"}
                        //     textAlign={"ltr:text-left rtl:text-right"}
                        //   />
                        // </div>
                      )}
                    </div>
                  )}
                  {result.dueDate && (
                    <>
                      <div className="flex flex-row items-center">
                        <span
                          className="w-[9px] h-[9px] bg-black rounded-sm"
                          style={{ transform: "matrix(-1, 0, 0, 1, 0, 0)" }}
                        />
                        <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">{t("date")}.</span>
                        <span className="rtl:mr-1 ltr:ml-1 text-black">
                          {result.dueDate ? getDate(result.dueDate, lang) : "----"}
                        </span>
                      </div>
                      <div className="flex flex-row items-center lg:pt-3">
                        <span
                          className="w-[9px] h-[9px] bg-black rounded-sm"
                          style={{ transform: "matrix(-1, 0, 0, 1, 0, 0)" }}
                        />
                        <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">{t("time")}.</span>
                        <span className="rtl:mr-1 ltr:ml-1 text-black">
                          {result.dueDate ? getJustTime(result.dueDate, lang) : "----"}
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
                        {audience?.maxAge && (
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
                  <ShowMoreText
                    text={result.description}
                    length={260}
                    wrapperTextAlign={"ltr:text-left rtl:text-right"}
                    textAlign={"ltr:text-left rtl:text-right"}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {result.requirements?.length > 0 && (
          <RequirementSlides
            isRequest={true}
            projectId={result._id}
            donateDisabled={donateDisabled}
            requirements={result.requirements}
            projectRequirementData={result?.projectRequirementData}
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
                      href={`/search?source=request&sort=LATEST&subjects=${result.subjects[0]?._id}`}
                      className="rtl:mr-1 ltr:ml-1 text-main2 underline"
                      prefetch={false}
                    >
                      {result.subjects[0]?.name}
                    </Link>
                  ) : (
                    <span className="rtl:mr-1 ltr:ml-1 text-black my-2">{t("other")}</span>
                    // <div className="w-full">
                    //   <ShowMoreText
                    //     text={result.subjectOtherDescription}
                    //     length={30}
                    //     wrapperTextAlign={"ltr:text-left rtl:text-right"}
                    //     textAlign={"ltr:text-left rtl:text-right"}
                    //   />
                    // </div>
                  )}
                </div>
              )}
              {result?.dueDate && (
                <>
                  <div className="flex flex-row items-center">
                    <span
                      className="w-[9px] h-[9px] bg-black rounded-sm"
                      style={{ transform: "matrix(-1, 0, 0, 1, 0, 0)" }}
                    />
                    <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">{t("date")}.</span>
                    <span className="rtl:mr-1 ltr:ml-1 text-black">
                      {result.dueDate ? getDate(result.dueDate, lang) : "----"}
                    </span>
                  </div>
                  <div className="flex flex-row items-center ">
                    <span
                      className="w-[9px] h-[9px] bg-black rounded-sm"
                      style={{ transform: "matrix(-1, 0, 0, 1, 0, 0)" }}
                    />
                    <span className="rtl:mr-[5px] ltr:ml-[5px] text-gray3">{t("time")}.</span>
                    <span className="rtl:mr-1 ltr:ml-1 text-black">
                      {result.dueDate ? getJustTime(result.dueDate, lang) : "----"}
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
                    {audience?.maxAge && (
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
              <ShowMoreText
                text={result.description}
                length={260}
                wrapperTextAlign={"ltr:text-left rtl:text-right"}
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

        <div className="mt-[40px]">
          <h1 className="heading text-black text-center mb-[40px] lg:text-[24px]">
            {t("comments")}
          </h1>
          <CommentForm
            classNames="mb-[44px]"
            dir={dir}
            targetId={result._id}
            targetType="PROJECT_REQUEST"
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
                  key={"commentCardzg" + i}
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

      <ShareModal
        t={t}
        data={result}
        open={openShareBottomSheet}
        shareLink={`${process.env.NEXT_PUBLIC_PUBLISH_DOMAIN}/${lang}/project-request-profile/${result._id}`}
        close={() => {
          setOpenShareBottomSheet(false);
          toast.remove();
        }}
      />

      <ViolationReportBottomSheet
        lang={lang}
        t={t}
        setOpenViolationReportBottomSheet={setOpenViolationReportBottomSheet}
        openViolationReportBottomSheet={openViolationReportBottomSheet}
        targetType="REQUEST"
        targetId={result._id}
      />

      <BottomSheet open={openScore} setOpen={setOpenScore}>
        <Score data={result} setOpen={setOpenScore} refetch={refetch} />
      </BottomSheet>

      {isViewerOpen && (
        <ImageViewerModal
          imgs={result.imgs}
          currentImage={currentImage}
          open={isViewerOpen}
          setOpen={setIsViewerOpen}
        />
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
