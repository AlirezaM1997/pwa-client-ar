import cx from "classnames";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { Like, MessageNotif } from "@lib/svg";
import { useTranslation } from "next-i18next";
//FUNCTION
import { getDate } from "@functions/getDate";
// GQL
import { LIKE_COMMENT } from "@services/gql/mutation/LIKE_COMMENT";
//COMPONENT
import ShowMoreText from "@components/common/ShowMoreText";
import ViolationReportBottomSheet from "./ViolationReportBottomSheet";

export default function CommentCard({
  setIsLoading,
  data,
  refetch,
  setShowLogin,
  showAsReply = false,
  classNames = "",
  maxText = false,
}) {
  const lang = getCookie("NEXT_LOCALE");
  const { t } = useTranslation();
  const router = useRouter();
  const [openViolationReportBottomSheet, setOpenViolationReportBottomSheet] = useState(false);
  const [like, setLike] = useState(false);
  const [likeCount, setCountLike] = useState(0);
  const [dislike, setDislike] = useState(false);
  const [dislikedCount, setCountDisliked] = useState(0);
  const accounts = useSelector((state) => state.accounts.accounts);
  const token = useSelector((state) => state.token);
  const currentUser = accounts.filter((i) => i._id === token?._id);
  const [Like_comments] = useMutation(LIKE_COMMENT);

  const initialStatus = () => {
    setLike(data?.haveILiked ?? false);
    setDislike(data?.haveIdisliked ?? false);
    setCountLike(data?.likeCount ?? 0);
    setCountDisliked(data?.dislikeCount ?? 0);
  };

  useEffect(() => {
    initialStatus();
  }, [data]);

  const toggleLike = () => {
    setCountLike(like ? likeCount - 1 : likeCount + 1);
    setLike(!like);
  };

  const toggleDisLike = () => {
    setCountDisliked(dislike ? dislikedCount - 1 : dislikedCount + 1);
    setDislike(!dislike);
  };

  const onChangeLike = async (likeStatus) => {
    const variables = {
      commentId: data._id,
      state: likeStatus,
    };
    try {
      const {
        data: {
          like_comment: { status },
        },
      } = await Like_comments({ variables });
      if (status === 200) {
        refetch && refetch();
        if (likeStatus == "LIKE") {
          toggleLike();

          if (dislike) {
            toggleDisLike();
          }
        }

        if (likeStatus == "DISLIKE") {
          toggleDisLike();

          if (like) {
            toggleLike();
          }
        }
      }
    } catch (error) {
      if (error.message === "Authorization failed" || error.message === "Token required") {
        setShowLogin(true);
      }
    }
  };

  const handleReportButton = () => {
    if (token?._id && currentUser[0]?.name) {
      setOpenViolationReportBottomSheet(true);
    } else {
      setShowLogin(true);
    }
  };

  return (
    <>
      <div
        className={`bg-white p-[10px] ${
          !showAsReply ? "border border-gray5" : "pb-[16px] border-b-[1.5px] border-gray6"
        } ${classNames}
         `}
      >
        <div className="flex items-center gap-[10px]">
          <div className="relative w-[50px] h-[50px]">
            <Image
              src="/assets/images/default-user-image.png"
              layout="fill"
              alt="profile_user"
              className="rounded-full cover-center-img"
            ></Image>
          </div>
          <div className="flex flex-col gap-[3px]">
            <span itemType="" className="heading text-black">
              {data.creator.name}
            </span>
            <div className="flex flex-row gap-1">
              <span className="caption1 text-gray1">{getDate(data.createdAt, lang)}.</span>
            </div>
          </div>
        </div>
        <div className="mt-[11px] mb-[18px] caption1 text-black  break-words lg:text-[18px] lg:leading-[30px]">
          {!maxText ? (
            <ShowMoreText
              text={data?.text}
              length={140}
              wrapperTextAlign={lang === "en" ? "text-left" : "text-right"}
              textAlign={lang === "en" ? "text-left" : "text-right"}
            />
          ) : (
            <>
              {data?.text.slice(0, 140)}
              {data?.text.length > 140 ? "..." : ""}
            </>
          )}
        </div>

        <div
          className={`flex items-center justify-between box-content
           ${!showAsReply ? "pt-[9px] border-t-[1.5px] border-gray5 " : ""}`}
        >
          <div className="flex items-center gap-[5px] h-full">
            <button
              className={cx(
                "flex flex-row-reverse justify-center items-center px-2 h-[34px] w-[50px] gap-[4.5px] caption3 border-[1.5px] rounded-lg border-gray5 text-gray1",
                { "text-success border-success bg-[#43936C1A] bg-opacity-[10%]": like }
              )}
              onClick={() => onChangeLike("LIKE")}
            >
              <span>{likeCount}</span>
              <Like w={12.58} h={13.4} color={like && "#43936C"} />
            </button>
            <button
              className={cx(
                "flex flex-row-reverse justify-center items-center px-2 h-[34px] w-[50px] gap-[4.5px] caption3 border-[1.5px] rounded-lg border-gray5 text-gray1",
                { "text-red3 border-red3 bg-[#CB3A311A] bg-opacity-[10%]": dislike }
              )}
              onClick={() => onChangeLike("DISLIKE")}
            >
              <span>{dislikedCount}</span>
              <Like w={12.58} h={13.4} dir="down" color={dislike && "#CB3A31"} />
            </button>
            {!showAsReply && (
              <button
                onClick={() => {
                  router.push(
                    {
                      pathname: `/reply-comment/${data._id}`,
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
                className="flex flex-row justify-center items-center gap-[5px] px-2 h-[34px] cursor-pointer border-[1.5px] rounded-lg border-gray5"
              >
                <MessageNotif w={14} onClick={() => setIsLoading(true)} />
                <span className="caption3 text-gray1 tracking-[-0.24px]">{data?.replyCount}</span>
              </button>
            )}
          </div>
          <button
            className="caption1 text-gray1 border-[1.5px] rounded-lg border-gray5 px-4 h-[34px]"
            onClick={() => handleReportButton()}
          >
            {t("report")}
          </button>
        </div>
      </div>
      <ViolationReportBottomSheet
        lang={lang}
        t={t}
        setOpenViolationReportBottomSheet={setOpenViolationReportBottomSheet}
        openViolationReportBottomSheet={openViolationReportBottomSheet}
        targetType="COMMENT"
        targetId={data._id}
      />
    </>
  );
}
