import { Share } from "@lib/svg";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { CloseCircle, Star1, Verify } from "iconsax-react";
import StarRatingComponent from "react-star-rating-component";
// GQL
import { GET_ASSOCIATION_BYID_SUMMERY } from "@services/gql/query/GET_ASSOCIATION_BYID_SUMMERY";
// COMPONENT
import Loading from "@components/kit/loading/Loading";
import CustomButton from "@components/kit/button/CustomButton";
// COMPONENT DYNAMIC IMPORT
const ShareModal = dynamic(() => import("@components/common/ShareModal"), { ssr: false });

export default function AssociationCardOffcanvas({ setOpenOffcanvas, associationId, t }) {
  const router = useRouter();
  const [association, setAssociation] = useState(null);
  const lang = getCookie("NEXT_LOCALE");
  const [openShareBottomSheet, setOpenShareBottomSheet] = useState(false);

  const { data, loading, error } = useQuery(GET_ASSOCIATION_BYID_SUMMERY, {
    variables: {
      id: associationId,
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (data) {
      setAssociation(data.get_association_byId);
    }
  }, [data]);

  if (loading) {
    return <Loading loadingWidth="w-[360px]" />;
  }

  if (error) {
    return <h5>{error.message}</h5>;
  }

  return (
    <>
      <section className="px-7 pt-[140px] w-full relative h-screen">
        <div className="flex items-center justify-between mb-[5px]">
          <div
            className="flex items-center justify-center w-[30px] h-[30px] bg-gray6 rounded-full cursor-pointer mx-1"
            onClick={(e) => {
              e.stopPropagation();
              setOpenShareBottomSheet(true);
            }}
          >
            <Share color={"rgba(72, 72, 72, 1)"} />
          </div>
          <div className="cursor-pointer mx-1" onClick={() => setOpenOffcanvas(false)}>
            <CloseCircle color="black" size={21} />
          </div>
        </div>
        <div className="flex flex-col relative">
          <div className={`flex flex-col mt-3 rounded-2xl w-full`}>
            <div className={`relative w-[300px] h-[188px] rounded-[16px]`}>
              <Image
                src={association?.image || "/assets/images/default-association-offcanvas.png"}
                layout="fill"
                alt="association"
                className="rounded-[16px]"
              ></Image>
            </div>
            <div className="flex flex-row items-center gap-2 mt-[6px] ltr:text-left rtl:text-right w-full">
              <h1 className="text-black heading leading-[40px]">{association?.name}</h1>
              {association?.verifyBadge && (
                <Verify size="14" color="#2889d7" variant="Bold" className="shrink-0" />
              )}
            </div>
            {association?.averageScore > 0 && (
              <div className="starIconClass flex items-center mb-[14px]">
                <StarRatingComponent
                  name="rate1"
                  value={association?.averageScore || 0}
                  renderStarIcon={(index) => {
                    return (
                      <span>
                        {index <= association?.averageScore ? (
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
                  ({association?.scoreCount ? association?.scoreCount : 0})
                </span>
              </div>
            )}
            <div className="flex items-center gap-[18px] mb-[25px]">
              <div className="flex items-center gap-[6px]">
                <span className="title2 text-black">{association?.projectsCount}</span>
                <p className="title1 text-gray4">{t("project")}</p>
              </div>
              <div className="flex items-center gap-[6px]">
                <span className="title1 text-black">
                  {association?.followerCount ? association?.followerCount : 0}
                </span>
                <p className="title2 text-gray4">{t("follower")}</p>
              </div>
              <div className="flex items-center gap-[6px]">
                <span className="title1 text-black">
                  {association?.followerCount ? association?.followingCount : 0}
                </span>
                <p className="title2 text-gray4">{t("following")}</p>
              </div>
            </div>
            <h1 className="heading text-black mb-[8px] ltr:text-left">{t("overView")}</h1>
            <p className="captionDesktop4 leading-[26px] ltr:text-left w-full break-words">
              {association?.bio?.slice(0, 60)}
              {association?.bio?.length > 60 && " ... "}
            </p>
          </div>
        </div>
        <div className=" absolute left-1/2 -translate-x-1/2 bottom-4">
          <CustomButton
            onClick={() =>
              router.push(`/association-profile/${association._id}`, undefined, { shallow: true })
            }
            bgColor="bg-main2"
            paddingX="p-[18px]"
            title={t("seeProfile")}
            width="w-[302px]"
            size="M"
          />
        </div>

        <ShareModal
          t={t}
          data={association}
          open={openShareBottomSheet}
          shareLink={`${process.env.NEXT_PUBLIC_PUBLISH_DOMAIN}/${lang}/association-profile/${associationId}`}
          close={() => {
            setOpenShareBottomSheet(false);
            toast.remove();
          }}
        />
        <style>
          {`
          .starIconClass svg {
            width : 15px ;
            height : 12px ;
          }
          .starIconFillClass svg {
            fill: #EFC840
          }
          .starIconUnFillClass svg {
            fill: #E8E8E8
          }
        `}
        </style>
      </section>
    </>
  );
}
