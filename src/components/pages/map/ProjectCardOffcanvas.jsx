import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { CloseCircle } from "iconsax-react";
import { useEffect, useState } from "react";
// GQL
import { GET_SINGLE_PROJECT_SUMMERY } from "@services/gql/query/GET_SINGLE_PROJECT_SUMMERY";
// COMPONENT
import Loading from "@components/kit/loading/Loading";
import MapProgressBar from "@components/common/MapProgressBar";
import CustomButton from "@components/kit/button/CustomButton";
// COMPONENT DYNAMIC IMPORT
const BookMarkButton = dynamic(() => import("@components/common/BookMark"), {
  ssr: false,
});
export default function ProjectCardOffcanvas({ setOpenOffcanvas, projectId, isRequest, t }) {
  const requirements = [
    { type: "MORAL", title: t("requirements.moral") },
    { type: "FINANCIAL", title: t("requirements.financial") },
    { type: "IDEAS", title: t("requirements.ideas") },
    { type: "CAPACITY", title: t("requirements.capacity") },
    { type: "PRESSENCE", title: t("requirements.pressence") },
    { type: "SKILL", title: t("requirements.skill") },
  ];
  const router = useRouter();
  const [projectInfo, setprojectInfo] = useState(null);

  const getSingleProject = useQuery(GET_SINGLE_PROJECT_SUMMERY, {
    variables: {
      id: projectId,
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (getSingleProject.data) {
      setprojectInfo(getSingleProject.data.getSingleProject);
    }
  }, [getSingleProject.data]);

  if (getSingleProject.loading) {
    return <Loading loadingWidth="w-[360px]" />;
  }
  return (
    <>
      <section className="px-5 pt-[140px] w-full relative h-screen">
        <div className="flex items-center justify-between mb-[10px]">
          {projectInfo?.bookmarkable && (
            <div className="flex items-center justify-center  w-[30px] h-[30px] bg-gray6 rounded-full cursor-pointer">
              <BookMarkButton
                id={projectInfo?._id}
                haveIBookmarked={projectInfo?.haveIBookmarked}
                refetch={getSingleProject.refetch}
                color={"black"}
                t={t}
                type={isRequest ? "REQUEST" : "PROJECT"}
              />
            </div>
          )}
          <div className=" cursor-pointer" onClick={() => setOpenOffcanvas(false)}>
            <CloseCircle color="black" size={21} />
          </div>
        </div>
        <div className="flex flex-col items-center relative">
          <div
            onClick={() =>
              router.push(`/project-profile/${projectInfo._id}`, undefined, { shallow: true })
            }
            className={`flex flex-col p-3 justify-center items-center cursor-pointer   rounded-2xl w-full`}
          >
            <div className={`relative w-[300px] h-[188px] rounded-[16px]`}>
              <Image
                src={
                  projectInfo?.imgs[0]
                    ? projectInfo?.imgs[0]
                    : "/assets/images/default-project-card-image.png"
                }
                layout="fill"
                alt={"project-image-Mofid"}
                className="rounded-[16px]"
              ></Image>
              {/* <div
              className="flex items-center justify-center absolute right-2 top-2 w-[30px] h-[30px] bg-white rounded-full "
              onClick={(e) => {
                e.stopPropagation();
                setOpenShareBottomSheet(true);
              }}
            >
              <Share color={"rgba(72, 72, 72, 1)"} />
            </div> */}
            </div>
            <h1 className="heading my-3 ltr:text-left rtl:text-right w-full">
              {projectInfo?.title}
            </h1>
            <div className=" w-full flex items-center justify-between gap-x-[6px]">
              {requirements?.map((i, index) => {
                return (
                  <h6
                    key={index}
                    className={`caption3 ${
                      !!projectInfo?.requirements?.find((o) => o.type === i.type)
                        ? "text-black"
                        : "text-gray4"
                    }`}
                  >
                    {i.title}
                  </h6>
                );
              })}
            </div>
            {!isRequest && (
              <div className="h-[55px] w-full flex items-center">
                {projectInfo && projectInfo?.requirements.length !== 0 ? (
                  <MapProgressBar data={projectInfo.projectRequirementData} />
                ) : (
                  <div className="w-full flex h-full items-center">
                    <p className="text-[11px] text-gray2 ltr:text-left">
                      {(projectInfo?.projectRequirementData?.participationsCount ?? 0) +
                        " " +
                        t("supporter")}
                    </p>
                  </div>
                )}
              </div>
            )}
            <h1 className="heading text-black mb-[21px] ltr:text-left w-full pt-5">
              {t("overView")}
            </h1>
            <p className="text-[18px] font-normal leading-[30px] ltr:text-left w-full break-words">
              {projectInfo?.description?.slice(0, 60)}
              {projectInfo?.description?.length > 60 && " ... "}
            </p>
          </div>
        </div>
        <div className=" absolute left-1/2 -translate-x-1/2 bottom-4">
          {!isRequest && (
            <CustomButton
              onClick={() =>
                router.push(`/participation/${projectId}?tab=1`, undefined, { shallow: true })
              }
              bgColor="bg-main2"
              paddingX="p-[18px]"
              title={t("donateNow")}
              width="w-[302px]"
              size="M"
            />
          )}
        </div>
      </section>
    </>
  );
}
