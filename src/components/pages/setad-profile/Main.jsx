import Link from "next/link";
import { Share } from "@lib/svg";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "@uidotdev/usehooks";
import { Home2, Flag, Message } from "iconsax-react";
//COMPONENT
import BackButton from "@components/common/BackButton";
import ShowMoreText from "@components/common/ShowMoreText";
import SquareBoxWithIcon from "@components/common/SquareBoxWithIcon";
// COMPONENT DYNAMIC IMPORT
const ShowLocation = dynamic(() => import("@components/common/ShowLocation"), {
  ssr: false,
});

export default function SetadProfile({
  data,
  setOpenShare,
  setShowFullScreenMap,
  setShowProfileImage,
  setProfileImageUrl,
  setOpenReport,
}) {
  //VARIABLE
  const router = useRouter();
  const { t } = useTranslation();
  const lang = getCookie("NEXT_LOCALE");
  const size = useWindowSize();

  //FUNCTION
  const handleShowProfileImg = () => {
    setShowProfileImage(true);
    setProfileImageUrl(data?.image ? data?.image : "/assets/images/default-association-image.png");
    document.body.style.overflow = "hidden";
  };

  //JSX
  return (
    <>
      <main className="px-4 lg:px-8 pb-[100px] max-w-[1320px] 2xl:mx-auto">
        <div className="pt-[18px] lg:pt-0 flex justify-between items-start w-full relative">
          <div className="flex items-center gap-x-[10px] lg:hidden">
            <BackButton
              bgColor="bg-main7"
              arrowColor="#03A6CF"
              onClick={() => router.back()}
              dir={["Ar", "ar"].includes(lang) ? "right" : "left"}
            />
            <SquareBoxWithIcon
              size="31px"
              classNames="bg-main7 rounded-full cursor-pointer"
              onClick={() => {
                router.push("/", undefined, { shallow: true });
              }}
              icon={<Home2 size="18" color="#03A6CF" />}
            />
          </div>
          <div className="flex items-center gap-x-[10px] lg:absolute lg:ltr:right-[14px] lg:rtl:left-[14px] lg:top-[54px] lg:z-50">
            <SquareBoxWithIcon
              size={"31px"}
              classNames="bg-main7 rounded-full cursor-pointer"
              onClick={() => {
                setOpenShare(true);
              }}
              icon={<Share color="#03A6CF" />}
            />
            <SquareBoxWithIcon
              size="31px"
              classNames="bg-main7 rounded-full cursor-pointer"
              onClick={() => {
                setOpenReport(true);
              }}
              icon={<Flag size="18" color="#03A6CF" />}
            />
          </div>
        </div>
        <div
          className={`w-full relative h-[205px] lg:h-[480px] shadow rounded-lg lg:rounded-[14px] cursor-pointer my-[18px] lg:mb-[30px] lg:mt-[40px]`}
          onClick={handleShowProfileImg}
        >
          <Image
            src={data?.image ? data?.image : "/assets/images/default-association-image.png"}
            layout="fill"
            alt="profile-image"
            className="cover-center-img"
            priority={true}
          ></Image>
        </div>

        <div className="flex justify-between lg:justify-start lg:gap-x-5 items-center">
          <h1 className="heading lg:titleDesktop1">{data?.name}</h1>
          <Link
            href={
              size.width < 960
                ? `/messages/${data._id}?name=${data.name}`
                : `/messages/?id=${data._id}&name=${data.name}`
            }
            prefetch={false}
          >
            <Message />
          </Link>
        </div>

        <div className="mt-9 lg:mt-14">
          <h1 className="heading lg:titleDesktop1 mb-1">{t("description")}</h1>
          <ShowMoreText
            text={data.description}
            length={260}
            wrapperTextAlign={"ltr:text-left rtl:text-right"}
            textAlign={"ltr:text-left rtl:text-right"}
          />
        </div>

        {data.location?.address && (
          <div className="mt-9 lg:mt-14">
            <h1 className="heading lg:titleDesktop1 mb-1">{t("address")}</h1>
            <p className="text-gray2 caption1 lg:text-[18px] lg:leading-[30px]">
              {data.location?.address}
            </p>
          </div>
        )}

        {data.location?.geo?.lat && (
          <div
            className="w-full h-[204px] lg:h-[340px] mt-2 lg:mt-4 showLocation z-9-forShowLocation cursor-pointer rounded-lg lg:rounded-[14px] overflow-hidden"
            onClick={() => {
              setShowFullScreenMap(true);
              document.body.style.overflow = "hidden";
            }}
          >
            <ShowLocation lat={data.location.geo?.lat} lng={data.location.geo?.lon} zoom={5} />
          </div>
        )}
      </main>
    </>
  );
}
