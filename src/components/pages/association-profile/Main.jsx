import { Share } from "@lib/svg";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useWindowSize } from "@uidotdev/usehooks";
import StarRatingComponent from "react-star-rating-component";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { Map, Star1, Sms, MobileProgramming, Verify, Home2, Flag } from "iconsax-react";
// GQL
import { FOLLOW_ASSOCIATION } from "@services/gql/mutation/FOLLOW_ASSOCIATION";
// COMPONENT
import BackButton from "@components/common/BackButton";
import SquareBoxWithIcon from "@components/common/SquareBoxWithIcon";
import ShowMoreText from "@components/common/ShowMoreText";
import CustomButton from "@components/kit/button/CustomButton";
// COMPONENT DYNAMIC IMPORT
const Login = dynamic(() => import("@components/common/login/Main"), { ssr: false });
const ShareModal = dynamic(() => import("@components/common/ShareModal"), { ssr: false });
const ModalScreen = dynamic(() => import("@components/common/ModalScreen"), { ssr: false });
const SearchCard = dynamic(() => import("@components/pages/index/SearchCard"), { ssr: false });

const ViolationReportBottomSheet = dynamic(
  () => import("@components/common/ViolationReportBottomSheet"),
  { ssr: false }
);
const ShowLocation = dynamic(() => import("@components/common/ShowLocation"), {
  ssr: false,
});
const SingleImageViewer = dynamic(() => import("@components/common/SingleImageViewer"), {
  ssr: false,
});
const HorizontalCarousel = dynamic(() => import("@components/common/HorizontalCarousel"), {
  ssr: false,
});
const ShowFullScreenLocation = dynamic(() => import("@components/common/ShowFullScreenLocation"), {
  ssr: false,
});

export default function AssociationProfile({ data, projects, refetch, t, lang }) {
  const size = useWindowSize();
  const [openShareBottomSheet, setOpenShareBottomSheet] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const router = useRouter();
  const yourId = useSelector((state) => state.token._id);
  const currentUserId = useSelector((state) => state.token._id);
  const [showLogin, setShowLogin] = useState(false);
  const [showFullScreenMap, setShowFullScreenMap] = useState(false);
  const [showProfileImg, setShowProfileImg] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState(null);

  const mainList = [
    {
      title: data?.publicPhone || "- - -",
      description: t("association-profile.phone"),
      icon: <MobileProgramming color="#727272" />,
    },
    {
      title: data?.email || "- - -",
      description: t("association-profile.email"),
      icon: <Sms color="#727272" />,
    },
    {
      title: data?.location.address || "- - -",
      description: t("address"),
      icon: <Map color="#727272" />,
    },
  ];

  //////////////////////FUNCTIONS//////////////////////
  useEffect(() => {
    const x = getCookie("FOLLOW");
    if (x) {
      handleFollow();
    }
  }, []);

  const [follow] = useMutation(FOLLOW_ASSOCIATION);
  const handleFollow = async () => {
    try {
      const {
        data: { follow_association },
      } = await follow({
        variables: {
          associationId: data?._id,
        },
      });
      if (follow_association.status === 200) {
        deleteCookie("FOLLOW");
        refetch();
      }
    } catch (error) {
      console.error(error);
      if (error.message === "Authorization failed" || error.message === "Token required") {
        setCookie("FOLLOW", true);
        setShowLogin(true);
      }
    }
  };

  const handleShowProfileImg = () => {
    setShowProfileImg(true);
    setProfileImgUrl(data?.image ? data?.image : "/assets/images/default-association-image.png");
    document.body.style.overflow = "hidden";
  };

  return (
    <>
      <header className="">
        <div className="pt-[18px] px-4 flex justify-between items-start bg-default w-full h-[115px] relative">
          <div className="flex items-center gap-x-[10px]">
            <BackButton
              bgColor="bg-[#81D3E7]"
              arrowColor="#FDFDFD"
              onClick={() => router.back()}
              dir={["Ar", "ar"].includes(lang) ? "right" : "left"}
            />
            <SquareBoxWithIcon
              size="31px"
              classNames="bg-[#81D3E7] rounded-full cursor-pointer"
              onClick={() => {
                router.push("/", undefined, { shallow: true });
              }}
              icon={<Home2 size="16" color="#FDFDFD" />}
            />
          </div>
          <div className="flex items-center gap-x-[10px]">
            <SquareBoxWithIcon
              size="27px"
              classNames="bg-[#81D3E7] rounded-full cursor-pointer"
              onClick={() => {
                setOpenShareBottomSheet(true);
              }}
              icon={<Share color="#FDFDFD" />}
            />
            <SquareBoxWithIcon
              size="27px"
              classNames="bg-[#81D3E7] rounded-full cursor-pointer"
              onClick={() => {
                setOpenReport(true);
              }}
              icon={<Flag size="16" color="#FDFDFD" />}
            />
          </div>
          <div
            className={`w-[95px] h-[95px] bg-white absolute top-[72px] rounded-full border-[4px] border-white cursor-pointer`}
            onClick={handleShowProfileImg}
          >
            <Image
              src={data?.image ? data?.image : "/assets/images/default-association-image.png"}
              layout="fill"
              alt="profile-image"
              className="rounded-full cover-center-img"
              priority={true}
            ></Image>
          </div>
        </div>
        <div className="flex flex-col px-4 mt-[53px]">
          <div className="flex flex-row items-center gap-2 py-[14px]">
            <h1 className="title1">
              {`${data?.prename || ""} ${data?.justName || data?.name || "----"}`}
            </h1>
            {data?.verifyBadge && (
              <Verify size="14" color="#2889d7" variant="Bold" className="shrink-0 mt-1" />
            )}
          </div>
          {data?.averageScore > 0 && (
            <div className="starIconClass flex items-center">
              <StarRatingComponent
                name="rate1"
                value={data?.averageScore || 0}
                renderStarIcon={(index) => {
                  return (
                    <span>
                      {index <= data?.averageScore ? (
                        <div className="starIconFillClass mx-[2px]">
                          <Star1 color="#EFC840" />
                        </div>
                      ) : (
                        <div className="starIconUnFillClass mx-[2px]">
                          <Star1 color="#E8E8E8" />
                        </div>
                      )}
                    </span>
                  );
                }}
              />
              <span className="mx-1 text-gray2 caption4">
                ({data?.scoreCount ? data?.scoreCount : 0})
              </span>
            </div>
          )}
          <div className="flex items-center mt-3">
            <div className="flex items-center gap-[6px]">
              <span className="title2 text-black">{data?.projectsCount}</span>
              <p className="caption3 text-gray4">{t("project")}</p>
            </div>
            <div className="flex items-center mx-[15px] gap-[6px]">
              <span className="title2 text-black">
                {data?.followerCount ? data?.followerCount : 0}
              </span>
              <p className="caption3 text-gray4">{t("follower")}</p>
            </div>
            <div className="flex items-center gap-[6px]">
              <span className="title2 text-black">
                {data?.followerCount ? data?.followingCount : 0}
              </span>
              <p className="caption3 text-gray4">{t("following")}</p>
            </div>
          </div>
        </div>
      </header>

      {yourId !== data?._id && (
        <div className="flex items-center gap-x-3 px-4 mt-[18px]">
          <CustomButton
            onClick={() => handleFollow()}
            size="S"
            title={data?.haveIfollowed ? t("unfollow") : t("follow")}
            styleType={data?.haveIfollowed ? "Secondary" : "Primary"}
            textColor={data?.haveIfollowed ? "text-gray3" : "text-white"}
            borderColor="text-gray3"
            isFullWidth={true}
          />
          <CustomButton
            onClick={() => {
              currentUserId
                ? router.push(
                    {
                      pathname: size.width < 960 ? `/messages/${data?._id}` : "/messages",
                      query:
                        size.width < 960
                          ? { name: data?.name }
                          : { name: data?.name, id: data._id },
                    },
                    undefined,
                    { shallow: true }
                  )
                : setShowLogin(true);
            }}
            size="S"
            styleType="Secondary"
            title={t("message")}
            textColor="text-gray3"
            borderColor="text-gray3"
            isFullWidth={true}
          />
        </div>
      )}

      <main className="pt-[33px] pb-[79px]">
        {projects.length !== 0 && (
          <HorizontalCarousel
            link={`/association-profile/${data?._id}/projects`}
            lang={lang}
            t={t}
            title={t("projects")}
            linkTitle={
              <div className="inline-flex flex-row items-center gap-[6px]">
                <span>{t("seeMore")}</span>
                <BackButton
                  width="w-5"
                  height="h-5"
                  bgColor="bg-main7"
                  arrowColor="#03A6CF"
                  iconSize={12}
                  dir={["Ar", "ar"].includes(lang) ? "left" : "right"}
                />
              </div>
            }
            hasShowMore={true}
            array={projects?.map((i, _j) => {
              return (
                <div key={_j * 3}>
                  <SearchCard
                    t={t}
                    data={i}
                    lang={lang}
                    link={`/project-profile/${i._id}`}
                    title={i.title}
                    imgUrl={i?.imgs && i?.imgs[0] ? i?.imgs[0] : null}
                  />
                </div>
              );
            })}
          />
        )}
        {data?.bio && (
          <div className="px-4 mt-[40px]">
            <h1 className="titleInput text-black1 mb-2">{t("about")}</h1>
            {data?.bio && <ShowMoreText text={data?.bio} length={260} wrapperTextAlign="" />}
          </div>
        )}
        {data?.missionStatement && (
          <div className="px-4 mt-[40px]">
            <h1 className="titleInput text-black1 mb-2">
              {t("association-profile.missionStatement")}
            </h1>
            {data?.missionStatement && (
              <ShowMoreText text={data?.missionStatement} length={260} wrapperTextAlign="" />
            )}
          </div>
        )}
        <div className="flex flex-col px-4 gap-[24px] mt-[24px] mb-[21px]">
          {mainList.map((item, _index) => (
            <div key={_index} className="flex items-center gap-[7px]">
              <div className="w-[38px] h-[38px] flex items-center justify-center bg-gray6 rounded-lg shrink-0">
                {item.icon}
              </div>
              <div>
                <h1 className="textInput text-gray1">{item.title}</h1>
                <p className="text-gray2 caption3">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        {data?.location?.geo?.lat && (
          <div
            className="w-full h-[150px] px-4 showLocation z-9-forShowLocation"
            onClick={() => {
              setShowFullScreenMap(true);
              document.body.style.overflow = "hidden";
            }}
          >
            <ShowLocation lat={data?.location.geo?.lat} lng={data?.location.geo?.lon} zoom={4} />
          </div>
        )}
        {showFullScreenMap && (
          <ShowFullScreenLocation
            showFullScreenMap={showFullScreenMap}
            setShowFullScreenMap={setShowFullScreenMap}
            lat={data.location.geo?.lat}
            lng={data.location.geo?.lon}
          />
        )}
      </main>

      <ShareModal
        t={t}
        data={data}
        open={openShareBottomSheet}
        shareLink={`${process.env.NEXT_PUBLIC_PUBLISH_DOMAIN}/${lang}/association-profile/${data?._id}`}
        close={() => {
          setOpenShareBottomSheet(false);
          toast.remove();
        }}
      />

      {showLogin && (
        <ModalScreen open={showLogin}>
          <Login setShowLogin={setShowLogin} modalMode={true} t={t} landingRoute={router.asPath} />
        </ModalScreen>
      )}

      <SingleImageViewer
        open={showProfileImg}
        setOpen={setShowProfileImg}
        url={profileImgUrl}
        setUrl={setProfileImgUrl}
      />

      <ViolationReportBottomSheet
        lang={lang}
        t={t}
        setOpenViolationReportBottomSheet={setOpenReport}
        openViolationReportBottomSheet={openReport}
        targetType="ASSOCIATION"
        targetId={data._id}
      />

      <style>
        {`
          .starIconClass svg {
            width : 16px ;
            height : 16px ;
          }
          .starIconFillClass svg {
            fill: #EFC840
          }
          .starIconUnFillClass svg {
            fill: #E8E8E8
          }
        `}
      </style>
    </>
  );
}
