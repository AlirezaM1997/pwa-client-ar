import Link from "next/link";
import { Share } from "@lib/svg";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { toast } from "react-hot-toast";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Star1, Verify } from "iconsax-react";
import StarRatingComponent from "react-star-rating-component";
// GQL
import { GET_ASSOCIATION_BYID_SUMMERY } from "@services/gql/query/GET_ASSOCIATION_BYID_SUMMERY";
// COMPONENT
import Loading from "@components/kit/loading/Loading";
import CustomButton from "@components/kit/button/CustomButton";
// COMPONENT DYNAMIC IMPORT
const ShareModal = dynamic(() => import("@components/common/ShareModal"), {
  ssr: false,
});

export default function AssociationCard({
  t,
  data,
  imgUrl,
  cardId,
  imgHeight = "h-[180px]",
  hasBorder = true,
  openInNewTab = false,
}) {
  const [openShareBottomSheet, setOpenShareBottomSheet] = useState(false);
  const [result, setResult] = useState(null);
  const [imageLink, setImageLink] = useState(null);
  const lang = getCookie("NEXT_LOCALE");

  const [getAssociation, { error, loading, data: associationData }] = useLazyQuery(
    GET_ASSOCIATION_BYID_SUMMERY,
    {
      variables: {
        id: cardId,
      },
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    if (!data) {
      getAssociation();
    } else {
      setResult(data);
      setImageLink(imgUrl);
    }
  }, [data]);

  useEffect(() => {
    if (associationData) {
      setResult(associationData?.get_association_byId);
      setImageLink(associationData?.get_association_byId?.image ?? null);
    }
  }, [associationData]);

  if (loading) return <Loading loadingHeight="200px" />;
  if (error) return <h1 className="w-full text-center py-10">{error?.message}</h1>;

  return (
    <>
      <Link
        href={`/association-profile/${cardId}`}
        target={openInNewTab ? "_blank" : "_self"}
        rel={openInNewTab ? "noopener,noreferrer" : ""}
        className={`flex flex-col p-3 cursor-pointer ${
          hasBorder ? "border-gray5 border-2" : ""
        }  rounded-2xl w-full`}
        prefetch={false}
      >
        <div className={`relative ${imgHeight} w-full rounded-[16px]`}>
          <Image
            src={imageLink ? imageLink : "/assets/images/default-association-card-image.png"}
            layout="fill"
            alt="associaton"
            className="rounded-[16px] cover-center-img"
          ></Image>
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
        <div className="flex flex-row items-center gap-2 my-[15px]">
          <h1 className="text-black cta1">{result?.name}</h1>
          {result?.verifyBadge && (
            <Verify size="14" color="#2889d7" variant="Bold" className="shrink-0" />
          )}
        </div>
        {result?.averageScore > 0 && (
          <div className="starIconClass flex items-center mb-3">
            <StarRatingComponent
              name="rate1"
              value={result?.averageScore || 0}
              renderStarIcon={(index) => {
                return (
                  <span>
                    {index <= result?.averageScore ? (
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
              ({result?.scoreCount ? result?.scoreCount : 0})
            </span>
          </div>
        )}
        <div className="flex items-center gap-[26px] mb-[22px]">
          <div className="flex items-center gap-[6px]">
            <span className="title2 text-black">{result?.projectsCount}</span>
            <p className="caption3 text-gray4">{t("project")}</p>
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="title2 text-black">
              {result?.followerCount ? result?.followerCount : 0}
            </span>
            <p className="caption3 text-gray4">{t("follower")}</p>
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="title2 text-black">
              {result?.followerCount ? result?.followingCount : 0}
            </span>
            <p className="caption3 text-gray4">{t("following")}</p>
          </div>
        </div>
        <CustomButton
          onClick={() => null}
          bgColor="bg-main2"
          paddingX="p-[18px]"
          title={t("seeProfile")}
          isFullWidth={true}
        />
        <ShareModal
          t={t}
          data={result}
          open={openShareBottomSheet}
          shareLink={`${process.env.NEXT_PUBLIC_PUBLISH_DOMAIN}/${lang}/association-profile/${result?._id}`}
          close={() => {
            setOpenShareBottomSheet(false);
            toast.remove();
          }}
        />
      </Link>
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
    </>
  );
}
