import Link from "next/link";
import { Share } from "@lib/svg";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { toast } from "react-hot-toast";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { DollarCircle, Profile2User, User } from "iconsax-react";
import { moneyFormatter } from "@functions/moneyFormatter";
//GQL
import { GET_SINGLE_PROJECT_SUMMERY } from "@services/gql/query/GET_SINGLE_PROJECT_SUMMERY";
//COMPONENT
import Loading from "@components/kit/loading/Loading";
import Skeleton from "@components/kit/skeleton/Main";
import CustomButton from "@components/kit/button/CustomButton";
// COMPONENT DYNAMIC IMPORT
const ShareModal = dynamic(() => import("@components/common/ShareModal"), {
  ssr: false,
});
const BookMarkButton = dynamic(() => import("@components/common/BookMark"), {
  ssr: false,
});

export default function ProjectCard({
  t,
  data,
  refetch,
  imgUrl,
  cardId,
  isRequest,
  isPrivate,
  imgHeight = "h-[180px]",
  hasBorder = true,
  openInNewTab = false,
}) {
  const requirements = [
    { type: "MORAL", title: t("requirements.moral") },
    { type: "FINANCIAL", title: t("requirements.financial") },
    { type: "IDEAS", title: t("requirements.ideas") },
    { type: "CAPACITY", title: t("requirements.capacity") },
    { type: "PRESSENCE", title: t("requirements.pressence") },
    { type: "SKILL", title: t("requirements.skill") },
  ];
  const [openShareBottomSheet, setOpenShareBottomSheet] = useState(false);
  const [result, setResult] = useState(null);
  const [imageLink, setImageLink] = useState(null);
  const lang = getCookie("NEXT_LOCALE");

  const href = (() => {
    if (isPrivate) {
      if (isRequest) return `/activity/project-request-management/${cardId}`;
      else return `/activity/project-management/${cardId}`;
    } else {
      if (isRequest) return `/project-request-profile/${cardId}`;
      else return `/project-profile/${cardId}`;
    }
  })();

  const [callGetProject, { error, loading, data: projectData, refetch: projectRefetch }] =
    useLazyQuery(GET_SINGLE_PROJECT_SUMMERY, {
      variables: {
        id: cardId,
      },
      fetchPolicy: "no-cache",
    });

  useEffect(() => {
    if (isRequest) {
      if (!data) {
        null;
      } else {
        setResult(data);
        setImageLink(imgUrl);
      }
    } else {
      if (!data) {
        callGetProject();
      } else {
        setResult(data);
        setImageLink(imgUrl);
      }
    }
  }, [data]);

  useEffect(() => {
    if (projectData) {
      setResult(projectData?.getSingleProject);
      setImageLink(projectData?.getSingleProject?.imgs[0] ?? null);
    }
  }, [projectData]);

  if (loading) return <Loading loadingHeight="200px" />;

  if (!result)
    return (
      <>
        <div
          className={`flex flex-col p-3 justify-center items-center cursor-pointer ${
            hasBorder ? "border-gray5 border-2" : ""
          }  rounded-2xl w-full`}
        >
          <Skeleton height={180} borderRadius={16} />
          <span className="m-[2px]"></span>
          <Skeleton height={16.5} borderRadius={12} />
          {!isRequest && (
            <>
              <span className="m-[2px]"></span>
              <Skeleton height={45} borderRadius={12} />
              <span className="m-[2px]"></span>
              <Skeleton height={36} borderRadius={8} />
            </>
          )}
        </div>
      </>
    );

  if (error) return <h1 className="w-full text-center py-10">{error?.message}</h1>;

  return (
    <Link
      href={href}
      target={openInNewTab ? "_blank" : "_self"}
      rel={openInNewTab ? "noopener,noreferrer" : ""}
      className={`flex flex-col p-3 justify-center items-center cursor-pointer ${
        hasBorder ? "border-gray5 border-2" : ""
      }  rounded-2xl w-full`}
      prefetch={false}
    >
      <div className={`relative ${imgHeight} w-full rounded-[16px]`}>
        <Image
          src={imageLink ? imageLink : "/assets/images/default-project-card-image.png"}
          layout="fill"
          alt={"project"}
          className="rounded-[16px] cover-center-img"
        ></Image>

        <p className="w-[100%] ltr:text-left rtl:text-right bg-gradient-to-t from-black/80 via-black/40 min-h-[40px] rounded-b-[16px] absolute bottom-0 pt-[14px] px-2  text-[12px] text-white font-bold whitespace-nowrap overflow-hidden text-ellipsis ">
          {result?.title}
        </p>
        {result?.bookmarkable && (
          <div className="flex items-center justify-center absolute  left-2 top-2 w-[30px] h-[30px] bg-white rounded-full ">
            <BookMarkButton
              id={result?._id}
              haveIBookmarked={result?.haveIBookmarked}
              refetch={result ? refetch : projectRefetch}
              color={"black"}
              t={t}
              type={isRequest ? "REQUEST" : "PROJECT"}
            />
          </div>
        )}

        <div
          className="flex items-center justify-center absolute right-2 top-2 w-[30px] h-[30px] bg-white rounded-full "
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenShareBottomSheet(true);
          }}
        >
          <Share color={"rgba(72, 72, 72, 1)"} />
        </div>
      </div>

      {!isRequest ? (
        <div className="h-[55px] w-full flex items-center justify-center my-[28px]">
          <div className="flex justify-between w-full">
            <div className="flex flex-col items-center justify-center mb-1">
              <User size={24} color="#03A6CF" className="mb-3" />
              <p className="text-[12px] font-normal text-black">
                {data?.projectRequirementData?.participationsCount ?? 0}
              </p>
              <p className="text-[10px]">{t("numOfContributions")}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <DollarCircle size={24} color="#03A6CF" className="mb-3" />
              <p className="text-[12px] font-normal text-black">
                <span className="font-bold">
                  {moneyFormatter(data?.projectRequirementData?.participationsFinancialAmount) ?? 0}
                </span>
                <span className="ltr:mr-1 rtl:ml-1">{t("toman")}</span>
              </p>
              <p className="text-[10px]">{t("TContribution")}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Profile2User size={24} color="#03A6CF" className="mb-3" />
              <p className="text-[12px] font-normal text-black">{data?.participationCount ?? 0}</p>
              <p className="text-[10px]">{t("numOfSupporters")}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-[10px] w-full flex items-center justify-between gap-x-[7px]">
          {requirements?.map((i, index) => {
            return (
              <h6
                key={index}
                className={`text-[10px] font-normal  ${
                  result?.requirementsType
                    ? !!result?.type?.find((o) => o === String(i.type).toLowerCase())
                      ? "text-black"
                      : "text-gray4"
                    : !!result?.requirements?.find((o) => o.type === i.type)
                    ? "text-black"
                    : "text-gray4"
                }`}
              >
                {i.title}
              </h6>
            );
          })}
        </div>
      )}

      {!isRequest && (
        <CustomButton
          onClick={() => null}
          bgColor="bg-main2"
          paddingX="p-[18px]"
          title={isPrivate ? t("manageProject") : t("donateNow")}
          isFullWidth={true}
        />
      )}
      <ShareModal
        t={t}
        data={result}
        open={openShareBottomSheet}
        shareLink={`${process.env.NEXT_PUBLIC_PUBLISH_DOMAIN}/${lang}/${
          isRequest ? "project-request-profile" : "project-profile"
        }/${result?._id}`}
        close={() => {
          setOpenShareBottomSheet(false);
          toast.remove();
        }}
      />
    </Link>
  );
}
